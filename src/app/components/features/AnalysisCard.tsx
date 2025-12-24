'use client';

import { User, FileText } from 'lucide-react';
import { Badge, getBiasVariant } from '../ui/Badge';
import { cn } from '@/lib/utils';

interface AnalysisCardProps {
  title: string;
  byline?: string;
  wordCount: number;
  label: string;
  reasoning: string;
  confidence: number;
  className?: string;
}

export function AnalysisCard({
  title,
  byline,
  wordCount,
  label,
  reasoning,
  confidence,
  className,
}: AnalysisCardProps) {
  return (
    <article
      className={cn(
        'relative bg-surface border border-border/50 rounded-2xl overflow-hidden',
        'shadow-[var(--shadow-editorial)] hover:shadow-[var(--shadow-card-hover)]',
        'transition-all duration-500',
        'animate-reveal-up',
        className
      )}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent via-accent to-accent/50" />

      <div className="p-8 pl-10">
        {/* Header */}
        <header className="mb-6">
          <span className="label-accent mb-3 block">Analysis Results</span>
          <h2 className="headline-section text-2xl md:text-3xl text-fg mb-4">
            {title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            {byline && (
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {byline}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {wordCount.toLocaleString()} words
            </span>
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Bias indicators */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Badge variant={getBiasVariant(label)} size="lg">
            {label}
          </Badge>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <span className="text-xs uppercase tracking-wider text-fg-muted">
              Confidence
            </span>
            <span className="font-bold text-fg tabular-nums">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Reasoning with drop cap */}
        <div className="space-y-2">
          <h3 className="caption text-fg-muted">Analysis</h3>
          <p className="drop-cap body-editorial text-fg-muted leading-relaxed">
            {reasoning}
          </p>
        </div>
      </div>
    </article>
  );
}
