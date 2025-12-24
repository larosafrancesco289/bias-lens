'use client';

import Link from 'next/link';
import { Shield, Github } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

export function Masthead() {
  return (
    <header className="sticky top-0 z-50">
      {/* Main navbar */}
      <nav className="bg-surface/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:shadow-accent/30 transition-shadow">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-accent/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-tight text-fg">
                  BiasLens
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-fg-muted -mt-0.5 hidden sm:block">
                  Media Analysis
                </span>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/larosafrancesco289/bias-lens"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-fg-muted hover:text-fg rounded-lg hover:bg-muted/50 transition-all"
                aria-label="View on GitHub"
              >
                <Github className="h-4 w-4" />
                <span className="hidden md:inline">GitHub</span>
              </a>

              <div className="w-px h-6 bg-border hidden sm:block" />

              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </header>
  );
}
