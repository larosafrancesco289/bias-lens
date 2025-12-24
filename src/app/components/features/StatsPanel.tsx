'use client';

import { ProgressRing, getConfidenceColor } from '../ui/ProgressRing';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  confidence: number;
  categories: string[];
  label: string;
  className?: string;
}

export function StatsPanel({
  confidence,
  categories,
  label,
  className,
}: StatsPanelProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <aside
      className={cn(
        'bg-surface border border-border/50 rounded-2xl overflow-hidden',
        'shadow-[var(--shadow-editorial)]',
        'animate-reveal-up delay-100',
        className
      )}
    >
      <div className="p-6 space-y-6">
        {/* Confidence Ring */}
        <div className="flex flex-col items-center text-center">
          <span className="label-accent mb-4">Confidence Score</span>
          <ProgressRing
            progress={confidencePercent}
            size={140}
            strokeWidth={10}
            color={getConfidenceColor(confidence)}
          />
          <p className="text-sm text-fg-muted mt-4 max-w-[180px]">
            {confidencePercent >= 75
              ? 'High confidence in analysis accuracy'
              : confidencePercent >= 50
              ? 'Moderate confidence level'
              : 'Lower confidence - interpret with care'}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Categories */}
        <div>
          <h3 className="caption text-fg-muted mb-3">Topics Detected</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span
                key={i}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium',
                  'bg-muted/50 text-fg-muted',
                  'border border-transparent rounded-lg',
                  'hover:border-accent hover:text-accent',
                  'transition-all duration-200 cursor-default',
                  'animate-reveal-scale',
                )}
                style={{ animationDelay: `${200 + i * 50}ms` }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Bias spectrum */}
        <div>
          <h3 className="caption text-fg-muted mb-3">Bias Spectrum</h3>
          <div className="relative">
            {/* Labels */}
            <div className="flex justify-between text-[10px] text-fg-muted mb-2">
              <span>Strong Left</span>
              <span>Neutral</span>
              <span>Strong Right</span>
            </div>

            {/* Spectrum bar */}
            <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 relative">
              {/* Indicator */}
              <div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-fg rounded-full shadow-lg transition-all duration-500"
                style={{
                  left: `calc(${getSpectrumPosition(label)}% - 8px)`,
                  top: '50%',
                  marginTop: '-8px',
                }}
              />
            </div>

            {/* Current label */}
            <p className="text-center text-sm font-medium text-fg mt-3">
              {label}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function getSpectrumPosition(label: string): number {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes('strong left')) return 10;
  if (lowerLabel.includes('left')) return 25;
  if (lowerLabel.includes('slight left')) return 35;
  if (lowerLabel.includes('neutral') || lowerLabel.includes('balanced')) return 50;
  if (lowerLabel.includes('slight right')) return 65;
  if (lowerLabel.includes('right')) return 75;
  if (lowerLabel.includes('strong right')) return 90;

  // Default to center if unknown
  return 50;
}
