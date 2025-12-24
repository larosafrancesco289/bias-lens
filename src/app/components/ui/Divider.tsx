'use client';

import { cn } from '@/lib/utils';

interface DividerProps {
  variant?: 'default' | 'accent' | 'ornament' | 'dots';
  className?: string;
}

export function Divider({ variant = 'default', className }: DividerProps) {
  if (variant === 'ornament') {
    return (
      <div className={cn('flex items-center justify-center gap-4 py-2', className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-accent" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-1 h-1 rounded-full bg-accent" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-4', className)}>
        {[...Array(3)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
        ))}
      </div>
    );
  }

  if (variant === 'accent') {
    return (
      <div
        className={cn('editorial-rule-accent', className)}
        role="separator"
      />
    );
  }

  return (
    <div
      className={cn('editorial-rule', className)}
      role="separator"
    />
  );
}
