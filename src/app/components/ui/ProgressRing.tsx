'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  labelSuffix?: string;
  color?: 'accent' | 'success' | 'warning' | 'error';
}

const colorMap = {
  accent: 'var(--color-accent)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showLabel = true,
  labelSuffix = '%',
  color = 'accent',
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          className="opacity-40"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-fg tabular-nums">
            {Math.round(progress)}
          </span>
          <span className="text-xs text-fg-muted font-medium uppercase tracking-wider">
            {labelSuffix}
          </span>
        </div>
      )}
    </div>
  );
}

export function getConfidenceColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 0.75) return 'success';
  if (score >= 0.5) return 'warning';
  return 'error';
}
