import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import OpenAI from 'openai';
import { chromium, Page } from 'playwright';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim(),
});
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

interface BiasAnalysis {
  label: string;
  reasoning: string;
  confidence: number;
  categories: string[];
}

async function scrapeArticleWithJSDOM(url: string): Promise<{ title: string; content: string; byline?: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
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
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Set a realistic user agent and viewport
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    });
    await page.setViewportSize({ width: 1366, height: 768 });
    
    // Block unnecessary resources to speed up loading
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Try to close any modal/cookie banners
    try {
      await page.click('[data-testid="close-button"], .close, .modal-close, .cookie-accept, .gdpr-accept', { timeout: 1000 });
    } catch {
      // Ignore if no modal found
    }
    
    const html = await page.content();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      // Try fallback extraction if Readability fails
      return await extractContentFallback(page);
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

async function extractContentFallback(page: Page): Promise<{ title: string; content: string; byline?: string } | null> {
  try {
    
    // Try to extract title
    const title = await page.evaluate(() => {
      return document.querySelector('h1')?.textContent?.trim() ||
             document.querySelector('title')?.textContent?.trim() ||
             document.querySelector('[data-testid="headline"]')?.textContent?.trim() ||
             'Untitled Article';
    });

    // Try to extract main content using common selectors
    const content = await page.evaluate(() => {
      const selectors = [
        'article',
        '[data-testid="article-body"]',
        '.article-body',
        '.content',
        '.post-content',
        '.entry-content',
        'main p',
        '.story-body p'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          return Array.from(elements)
            .map(el => el.textContent?.trim())
            .filter(text => text && text.length > 50)
            .join('\n\n');
        }
      }

      // Last resort: get all p tags
      const paragraphs = document.querySelectorAll('p');
      return Array.from(paragraphs)
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 50)
        .join('\n\n');
    });

    // Try to extract byline
    const byline = await page.evaluate(() => {
      return document.querySelector('[data-testid="author"]')?.textContent?.trim() ||
             document.querySelector('.author')?.textContent?.trim() ||
             document.querySelector('.byline')?.textContent?.trim();
    });

    if (!content || content.length < 100) {
      return null;
    }

    return {
      title: title || 'Untitled Article',
      content,
      byline,
    };
  } catch (error) {
    console.error('Fallback extraction failed:', error);
    return null;
  }
}

async function analyzeArticleForBias(title: string, content: string): Promise<BiasAnalysis> {
  // Truncate content to fit within the 16k limit while leaving room for the prompt
  const maxContentLength = 14000;
  const truncatedContent = content.length > maxContentLength 
    ? content.substring(0, maxContentLength) + '... (truncated)'
    : content;

  const prompt = `You are an expert media analyst. Analyze the following news article for bias and provide a structured assessment.

Title: ${title}

Content: ${truncatedContent}

Please analyze this article for bias. Consider these factors:
- Language choice (emotionally charged vs neutral terms)
- Source selection and attribution balance
- Facts vs opinions ratio and presentation
- Balance of perspectives and viewpoints
- Framing, context, and narrative structure
- Omission of relevant information or counterarguments
- Headline and subheading tone
- Use of quotes and their context

CONFIDENCE SCORING GUIDELINES:
- 0.9-1.0: Very clear bias with multiple obvious indicators
- 0.7-0.9: Clear bias with several identifiable patterns
- 0.5-0.7: Some bias indicators present but not overwhelming
- 0.3-0.5: Subtle bias that requires careful analysis to detect
- 0.1-0.3: Very subtle or uncertain bias assessment
- 0.0-0.1: Insufficient evidence to determine bias

Be specific in your reasoning and cite concrete examples from the text. Vary your confidence scores based on the actual strength of evidence rather than defaulting to safe middle-ground values.

Output strictly as a single minified JSON object with exactly these keys and types:
{"label": string (one of: "Neutral", "Slight Left Bias", "Slight Right Bias", "Moderate Left Bias", "Moderate Right Bias", "Strong Left Bias", "Strong Right Bias"), "reasoning": string, "confidence": number between 0 and 1, "categories": string[]}

Do not include any additional text before or after the JSON.`;

  try {
    const systemInstruction = 'You are an objective media bias analyst. Provide balanced, evidence-based assessments of news articles. Respond with JSON only.';
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: `System: ${systemInstruction}\n\nUser:\n${prompt}`,
      max_output_tokens: 2000,
    });

    interface OpenAIResponsesTextChunk {
      text?: { value?: string };
    }
    interface OpenAIResponsesOutputItem {
      content?: OpenAIResponsesTextChunk[];
    }
    interface OpenAIResponsesResultMinimal {
      output_text?: string;
      output?: OpenAIResponsesOutputItem[];
    }

    const r = response as unknown as OpenAIResponsesResultMinimal;
    let text = r.output_text ?? r.output?.[0]?.content?.[0]?.text?.value ?? null;

    if (!text) {
      throw new Error('No response text from OpenAI');
    }

    // Strip code fences if present
    const fencedMatch = text.match(/```json[\s\S]*?```/i) || text.match(/```[\s\S]*?```/);
    if (fencedMatch) {
      text = fencedMatch[0]
        .replace(/```json/i, '')
        .replace(/```/g, '')
        .trim();
    }

    // Try direct parse first
    try {
      return JSON.parse(text) as BiasAnalysis;
    } catch {}

    // Attempt to extract the first valid JSON object by matching balanced braces
    function extractFirstJsonObject(source: string): string | null {
      let inString = false;
      let escape = false;
      let depth = 0;
      let start = -1;
      for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        if (inString) {
          if (escape) {
            escape = false;
          } else if (ch === '\\') {
            escape = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        } else {
          if (ch === '"') {
            inString = true;
            continue;
          }
          if (ch === '{') {
            if (depth === 0) start = i;
            depth++;
          } else if (ch === '}') {
            depth--;
            if (depth === 0 && start !== -1) {
              return source.slice(start, i + 1);
            }
          }
        }
      }
      return null;
    }

    const extracted = extractFirstJsonObject(text);
    if (extracted) {
      return JSON.parse(extracted) as BiasAnalysis;
    }

    throw new Error('Model did not return valid JSON.');
  } catch (error: unknown) {
    const errInfo = (() => {
      if (typeof error === 'object' && error !== null) {
        const e = error as { status?: number; response?: { status?: number; data?: unknown }; message?: string; error?: unknown };
        return {
          status: e.status ?? e.response?.status,
          data: e.response?.data ?? e.error ?? e.message,
        };
      }
      return {} as { status?: number; data?: unknown };
    })();
    console.error('OpenAI analysis failed:', errInfo);
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

    // Optional masked debug for env/model in development
    if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_OPENAI_KEY === '1') {
      const key = process.env.OPENAI_API_KEY?.trim() ?? '';
      const maskedKey = key ? `${key.slice(0, 6)}...${key.slice(-4)}` : 'missing';
      console.log('[BiasLens] OpenAI config (dev):', { model: OPENAI_MODEL, apiKey: maskedKey });
    }

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