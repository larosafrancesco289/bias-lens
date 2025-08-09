'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, TrendingUp, Clock, Github, X } from 'lucide-react';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { ThemeToggle } from './components/theme-toggle';

interface BiasResult {
  label: string;
  reasoning: string;
  confidence: number;
  categories: string[];
}

interface AnalysisResponse {
  title: string;
  byline?: string;
  wordCount: number;
  analysis: BiasResult;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BiasResult | null>(null);
  const [articleInfo, setArticleInfo] = useState<{ title: string; byline?: string; wordCount: number } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setError('');
    setResult(null);
    setArticleInfo(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      const analysisData: AnalysisResponse = data;
      setResult(analysisData.analysis);
      setArticleInfo({
        title: analysisData.title,
        byline: analysisData.byline,
        wordCount: analysisData.wordCount,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getBiasColor = (label: string) => {
    const lowerLabel = label.toLowerCase();
    
    // Neutral - Green (best)
    if (lowerLabel.includes('neutral') || lowerLabel.includes('balanced')) {
      return 'text-fg bg-muted';
    }
    
    // Slight bias - Yellow (mild concern)
    if (lowerLabel.includes('slight') || lowerLabel.includes('minor')) {
      return 'text-fg bg-muted';
    }
    
    // Moderate bias - Orange (moderate concern)
    if (lowerLabel.includes('moderate')) {
      return 'text-fg bg-muted';
    }
    
    // Strong/Heavy bias - Red (high concern)
    if (lowerLabel.includes('strong') || lowerLabel.includes('heavy') || lowerLabel.includes('significant')) {
      return 'text-fg bg-muted';
    }
    
    // Default fallback - Gray for unclear cases
    return 'text-fg-muted bg-muted';
  };

  return (
    <div className="min-h-screen bg-canvas transition-all duration-300 ease-in-out">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border transition-all duration-300 ease-in-out">
        <div className="max-w-4xl mx-auto px-6 py-6 md:py-8">
          {/* Mobile layout: stack vertically */}
          <div className="flex flex-col space-y-4 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/larosafrancesco289/bias-lens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-2xl border border-border bg-surface hover:bg-muted transition-colors"
                  aria-label="View on GitHub"
                >
                  <Github className="h-5 w-5 text-fg-muted" />
                </a>
                <ThemeToggle />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-fg mb-2">
                Bias Lens
              </h1>
              <p className="text-base text-fg-muted">
                AI-powered news article bias detection
              </p>
            </div>
          </div>
          
          {/* Desktop layout: keep original positioning */}
          <div className="hidden md:block relative">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-fg mb-2">
                Bias Lens
              </h1>
              <p className="text-lg text-fg-muted">
                AI-powered news article bias detection
              </p>
            </div>
            <div className="absolute top-2 right-0 flex items-center gap-3">
              <a 
                href="https://github.com/larosafrancesco289/bias-lens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-2xl border border-border bg-surface hover:bg-muted transition-colors"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5 text-fg-muted" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Input Form */}
        <Card className="p-8 mb-8 transition-all duration-300 ease-in-out">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-fg mb-2">
                Article URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/news-article"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-border bg-muted text-fg rounded-2xl focus:ring-2 focus:ring-[var(--ring-focus)] transition-colors placeholder:text-fg-muted"
                  required
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-fg-muted" />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="absolute right-4 top-3.5 p-0.5 text-fg-muted hover:text-fg transition-colors"
                    aria-label="Clear URL"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isAnalyzing || !url.trim()} className="w-full">
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 animate-spin" />
                  Analyzing Article...
                </span>
              ) : (
                'Analyze for Bias'
              )}
            </Button>
          </form>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-muted border border-border rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-fg" />
              <p className="text-fg">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <Card className="p-8 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-fg">Analysis Complete</h2>
            </div>

            <div className="space-y-6">
              {/* Article Info */}
              {articleInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-fg mb-2">Article Information</h3>
                  <div className="bg-muted p-4 rounded-2xl space-y-2 border border-border">
                    <h4 className="font-medium text-fg">{articleInfo.title}</h4>
                    {articleInfo.byline && (
                      <p className="text-fg-muted text-sm">By {articleInfo.byline}</p>
                    )}
                    <p className="text-fg-muted text-sm">
                      Word count: {articleInfo.wordCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {/* Bias Label */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">Bias Assessment</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${getBiasColor(result.label)}`}>
                  {result.label}
                </div>
              </div>

              {/* Confidence Score */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">Confidence Score</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-muted rounded-full h-3 border border-border">
                    <div
                      className="bg-accent h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-fg">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">Analysis Reasoning</h3>
                <p className="text-fg leading-relaxed bg-muted p-4 rounded-2xl">
                  {result.reasoning}
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">Article Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {result.categories.map((category, index) => (
                      <span
                      key={index}
                        className="px-3 py-1 bg-accent text-black rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Info Section */}
        {!result && !isAnalyzing && (
          <Card className="p-8 transition-all duration-300 ease-in-out">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-fg mb-2">How it works</h3>
              <p className="text-fg-muted max-w-2xl mx-auto">
                Our AI analyzes news articles for potential bias by examining language patterns, 
                source selection, framing, and factual presentation. Get objective insights to 
                help you consume news more critically.
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
