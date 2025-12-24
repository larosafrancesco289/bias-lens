'use client';

import { TrendingUp, Shield, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Analysis',
    description: 'Detects subtle framing, emotional language, and potential omission of facts using advanced AI.',
  },
  {
    icon: Shield,
    title: 'Source Evaluation',
    description: 'Evaluates source selection, attribution balance, and overall credibility indicators.',
  },
  {
    icon: BookOpen,
    title: 'Detailed Reports',
    description: 'Get granular insights into why an article might be biased with confidence scoring.',
  },
];

export function FeatureShowcase() {
  return (
    <div className="animate-reveal-up delay-200">
      {/* Section header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">How it works</span>
        </div>
        <h2 className="headline-section text-2xl text-fg">
          Powered by AI Analysis
        </h2>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className={cn(
              'group relative p-6 bg-surface/50 border border-border/30 rounded-2xl',
              'hover:bg-surface hover:border-border hover:shadow-lg',
              'transition-all duration-300 cursor-default',
              'animate-reveal-up'
            )}
            style={{ animationDelay: `${300 + i * 100}ms` }}
          >
            {/* Icon */}
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-lg text-fg mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-fg-muted leading-relaxed">
              {feature.description}
            </p>

            {/* Decorative corner */}
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-border/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
