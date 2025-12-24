'use client';

import { useState } from 'react';
import { Masthead } from './components/layout/Masthead';
import { Divider } from './components/ui/Divider';
import { URLInput } from './components/features/URLInput';
import { AnalysisCard } from './components/features/AnalysisCard';
import { StatsPanel } from './components/features/StatsPanel';
import { LoadingState } from './components/features/LoadingState';
import { FeatureShowcase } from './components/features/FeatureShowcase';

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
  const [articleInfo, setArticleInfo] = useState<{
    title: string;
    byline?: string;
    wordCount: number;
  } | null>(null);
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
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Masthead />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-reveal-up">
              <span className="label-accent inline-block mb-4">
                AI-Powered Analysis
              </span>
              <h1 className="headline-display text-4xl sm:text-5xl md:text-6xl text-fg mb-6">
                Uncover the Hidden
                <br />
                <span className="text-accent">Bias</span> in Your News
              </h1>
              <p className="body-editorial max-w-2xl mx-auto mb-8">
                Paste a news article URL below and let our AI analyze its
                language, framing, and sources to reveal potential biases and
                help you read more critically.
              </p>
            </div>

            <Divider variant="ornament" className="mb-12 animate-reveal-up delay-100" />

            {/* URL Input */}
            <div className="animate-reveal-up delay-200">
              <URLInput
                value={url}
                onChange={setUrl}
                onSubmit={handleSubmit}
                isLoading={isAnalyzing}
                error={error}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            {isAnalyzing ? (
              <LoadingState />
            ) : result && articleInfo ? (
              <div className="grid md:grid-cols-3 gap-6">
                <AnalysisCard
                  title={articleInfo.title}
                  byline={articleInfo.byline}
                  wordCount={articleInfo.wordCount}
                  label={result.label}
                  reasoning={result.reasoning}
                  confidence={result.confidence}
                  className="md:col-span-2"
                />
                <StatsPanel
                  confidence={result.confidence}
                  categories={result.categories}
                  label={result.label}
                />
              </div>
            ) : !error ? (
              <FeatureShowcase />
            ) : null}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-fg-muted">
            &copy; {new Date().getFullYear()} BiasLens. Objective Media Analysis.
          </p>
          <p className="text-xs text-fg-muted/60">
            Results are AI-generated and should be used as a starting point for critical analysis.
          </p>
        </div>
      </footer>
    </div>
  );
}
