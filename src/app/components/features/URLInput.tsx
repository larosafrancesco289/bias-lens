'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function URLInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  error,
}: URLInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(isValidUrl(value));
  }, [value]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={onSubmit} className="relative">
        {/* Glow effect on focus */}
        <div
          className={cn(
            'absolute -inset-1 rounded-2xl bg-accent/20 blur-xl transition-opacity duration-500',
            isFocused ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Input container */}
        <div
          className={cn(
            'relative bg-surface border-2 rounded-2xl shadow-lg transition-all duration-300',
            isFocused
              ? 'border-accent shadow-xl shadow-accent/10'
              : 'border-border/50 hover:border-border',
            error && 'border-error/50'
          )}
        >
          <div className="flex items-center">
            {/* Search icon */}
            <div className="pl-4 sm:pl-5">
              <Search
                className={cn(
                  'h-5 w-5 transition-colors duration-300',
                  isFocused ? 'text-accent' : 'text-fg-muted'
                )}
              />
            </div>

            {/* Input field */}
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Paste article URL..."
              className="flex-1 min-w-0 h-14 sm:h-16 px-3 sm:px-4 bg-transparent text-base sm:text-lg text-fg placeholder:text-fg-muted/40 focus:outline-none"
              required
              disabled={isLoading}
            />

            {/* Status indicators */}
            <div className="flex items-center gap-1 sm:gap-2 pr-2">
              {/* Valid URL indicator */}
              {value && isValid && !isLoading && (
                <div className="animate-reveal-scale">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              )}

              {/* Clear button */}
              {value && !isLoading && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 sm:p-2 text-fg-muted hover:text-fg hover:bg-muted rounded-lg transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className={cn(
                  'relative h-10 sm:h-12 px-4 sm:px-6 rounded-xl font-semibold text-sm uppercase tracking-wider',
                  'bg-accent text-white',
                  'hover:brightness-110 active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100',
                  'transition-all duration-200',
                  'shadow-lg shadow-accent/25 hover:shadow-accent/40'
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing</span>
                  </span>
                ) : (
                  <span>Analyze</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="animate-reveal-up flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-error">Analysis Failed</p>
            <p className="text-sm text-fg-muted mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
