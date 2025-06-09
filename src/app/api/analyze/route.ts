import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import OpenAI from 'openai';
import { chromium } from 'playwright';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BiasAnalysis {
  label: string;
  reasoning: string;
  confidence: number;
  categories: string[];
}

async function scrapeArticleWithJSDOM(url: string): Promise<{ title: string; content: string; byline?: string } | null> {
  try {
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.log('Readability failed to parse article');
      return null;
    }

    return {
      title: article.title,
      content: article.textContent,
      byline: article.byline,
    };
  } catch (error) {
    console.error('JSDOM scraping failed:', error);
    return null;
  }
}

async function scrapeArticleWithPlaywright(url: string): Promise<{ title: string; content: string; byline?: string } | null> {
  let browser;
  try {
    console.log(`Fallback: Using Playwright for ${url}`);
    browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait a bit for any dynamic content to load
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.log('Readability failed to parse article (Playwright fallback)');
      return null;
    }

    return {
      title: article.title,
      content: article.textContent,
      byline: article.byline,
    };
  } catch (error) {
    console.error('Playwright scraping failed:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function analyzeArticleForBias(title: string, content: string): Promise<BiasAnalysis> {
  const prompt = `You are an expert media analyst. Analyze the following news article for bias and provide a structured assessment.

Title: ${title}

Content: ${content.substring(0, 4000)}... ${content.length > 4000 ? '(truncated)' : ''}

Please analyze this article for bias and return a JSON response with the following structure:
{
  "label": "string (e.g., 'Neutral', 'Slight Left Bias', 'Moderate Right Bias', 'Strong Left Bias', etc.)",
  "reasoning": "string (2-3 sentences explaining your assessment)",
  "confidence": number (0.0 to 1.0, how confident you are in your assessment),
  "categories": ["array", "of", "article", "categories"] (e.g., ["Political", "News", "Opinion"])
}

Consider factors like:
- Language choice (emotionally charged vs neutral)
- Source selection and attribution
- Facts vs opinions presented
- Balance of perspectives
- Framing and context
- Omission of relevant information

Be objective and provide specific reasoning for your assessment.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an objective media bias analyst. Provide balanced, evidence-based assessments of news articles. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Clean the response in case it has markdown formatting
    const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();
    
    return JSON.parse(cleanedResponse) as BiasAnalysis;
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    // Return a fallback response
    return {
      label: 'Analysis Failed',
      reasoning: 'Unable to analyze the article due to a technical error. Please try again.',
      confidence: 0,
      categories: ['Error'],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // First, try scraping with JSDOM
    let articleData = await scrapeArticleWithJSDOM(url);

    // If JSDOM fails, try Playwright as fallback
    if (!articleData) {
      articleData = await scrapeArticleWithPlaywright(url);
    }

    if (!articleData || !articleData.content) {
      return NextResponse.json(
        { error: 'Failed to extract article content. The page might be protected or contain mostly dynamic content.' },
        { status: 400 }
      );
    }

    // Check if we have enough content to analyze
    if (articleData.content.length < 100) {
      return NextResponse.json(
        { error: 'Article content too short for meaningful analysis.' },
        { status: 400 }
      );
    }

    // Analyze the article for bias
    const biasAnalysis = await analyzeArticleForBias(articleData.title, articleData.content);

    return NextResponse.json({
      title: articleData.title,
      byline: articleData.byline,
      wordCount: articleData.content.split(/\s+/).length,
      analysis: biasAnalysis,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
} 