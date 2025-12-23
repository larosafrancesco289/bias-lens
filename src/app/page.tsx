'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, TrendingUp, Clock, Github, X, Shield, BookOpen, AlertTriangle } from 'lucide-react';
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
    if (lowerLabel.includes('neutral') || lowerLabel.includes('balanced')) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    if (lowerLabel.includes('slight')) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    if (lowerLabel.includes('moderate')) return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-canvas selection:bg-accent selection:text-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-fg">BiasLens</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/larosafrancesco289/bias-lens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg transition-colors hidden sm:block"
            >
              <Github className="h-5 w-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full flex flex-col gap-12">
        <div className="text-center space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-fg tracking-tight text-balance">
            Uncover the Hidden Bias in Your News
          </h1>
          <p className="text-lg md:text-xl text-fg-muted max-w-2xl mx-auto text-balance">
            Paste a news article URL below and let our AI analyze its language, framing, and sources to reveal potential biases.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-2xl mx-auto animate-fade-in-up delay-100">
          <Card className="p-2 md:p-3 shadow-lg shadow-accent/5 ring-1 ring-border/50">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-fg-muted pointer-events-none group-focus-within:text-accent transition-colors" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste article URL here..."
                  className="w-full h-14 pl-12 pr-32 bg-transparent text-lg text-fg placeholder:text-fg-muted/50 focus:outline-none rounded-xl"
                  required
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="absolute right-32 p-1 text-fg-muted hover:text-fg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute right-1 top-1 bottom-1">
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing || !url.trim()} 
                    size="md"
                    className="h-full px-6 shadow-none"
                  >
                    {isAnalyzing ? <Clock className="h-4 w-4 animate-spin" /> : 'Analyze'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 animate-fade-in-up">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && articleInfo && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
            {/* Main Analysis */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-8 h-full relative overflow-hidden" hoverEffect>
                <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-fg mb-1">{articleInfo.title}</h2>
                    <div className="flex items-center gap-2 text-fg-muted text-sm">
                      {articleInfo.byline && <span>By {articleInfo.byline}</span>}
                      <span>•</span>
                      <span>{articleInfo.wordCount.toLocaleString()} words</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${getBiasColor(result.label)}`}>
                      {result.label}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-fg-muted bg-muted px-3 py-1 rounded-full">
                      <span className="font-medium">Confidence:</span>
                      <span className="font-bold text-fg">{Math.round(result.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-fg flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      Analysis
                    </h3>
                    <p className="text-fg-muted leading-relaxed text-base">
                      {result.reasoning}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card className="p-6 h-full flex flex-col justify-between" hoverEffect>
                <div>
                   <h3 className="font-semibold text-fg mb-4 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Key Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.map((cat, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-surface border border-border rounded-lg text-xs font-medium text-fg-muted hover:border-accent transition-colors cursor-default"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-medium text-fg-muted uppercase tracking-wider">Bias Meter</span>
                     <span className="text-xs font-bold text-fg">{result.label}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getConfidenceColor(result.confidence)} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State / Info */}
        {!result && !isAnalyzing && !error && (
          <div className="grid md:grid-cols-3 gap-6 mt-8 animate-fade-in-up delay-300">
            {[
              { title: 'Smart Analysis', desc: 'Detects subtle framing, emotional language, and omission of facts.', icon: TrendingUp },
              { title: 'Source Checks', desc: 'Evaluates source selection and attribution balance.', icon: Shield },
              { title: 'Detailed Reports', desc: 'Get granular insights into why an article might be biased.', icon: BookOpen },
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-surface/50 border-transparent hover:border-border transition-colors text-center md:text-left">
                <feature.icon className="h-8 w-8 text-accent mb-4 mx-auto md:mx-0" />
                <h3 className="font-semibold text-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-fg-muted border-t border-border mt-auto">
        <p>© {new Date().getFullYear()} BiasLens. Objective Media Analysis.</p>
      </footer>
    </div>
  );
}