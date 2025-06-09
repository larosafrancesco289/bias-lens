'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, TrendingUp, Clock, Github } from 'lucide-react';
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
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
    }
    
    // Slight bias - Yellow (mild concern)
    if (lowerLabel.includes('slight') || lowerLabel.includes('minor')) {
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
    }
    
    // Moderate bias - Orange (moderate concern)
    if (lowerLabel.includes('moderate')) {
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30';
    }
    
    // Strong/Heavy bias - Red (high concern)
    if (lowerLabel.includes('strong') || lowerLabel.includes('heavy') || lowerLabel.includes('significant')) {
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
    }
    
    // Default fallback - Gray for unclear cases
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-300 ease-in-out">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out">
        <div className="max-w-4xl mx-auto px-6 py-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Bias Lens
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              AI-powered news article bias detection
            </p>
          </div>
          <div className="absolute top-8 right-6 flex items-center gap-3">
            <a 
              href="https://github.com/larosafrancesco289/bias-lens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Input Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8 transition-all duration-300 ease-in-out">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Article URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/news-article"
                  className="w-full px-4 py-3 pl-12 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !url.trim()}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 animate-spin" />
                  Analyzing Article...
                </span>
              ) : (
                'Analyze for Bias'
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Complete</h2>
            </div>

            <div className="space-y-6">
              {/* Article Info */}
              {articleInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Article Information</h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-white">{articleInfo.title}</h4>
                    {articleInfo.byline && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm">By {articleInfo.byline}</p>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Word count: {articleInfo.wordCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {/* Bias Label */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Bias Assessment</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${getBiasColor(result.label)}`}>
                  {result.label}
                </div>
              </div>

              {/* Confidence Score */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Confidence Score</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Analysis Reasoning</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  {result.reasoning}
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Article Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {result.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!result && !isAnalyzing && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300 ease-in-out">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">How it works</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Our AI analyzes news articles for potential bias by examining language patterns, 
                source selection, framing, and factual presentation. Get objective insights to 
                help you consume news more critically.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
