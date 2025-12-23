'use client';

import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverEffect?: boolean;
};

export function Card({ className = '', hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface border border-border rounded-2xl 
        shadow-[var(--shadow-card)] 
        ${hoverEffect ? 'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      {...props}
    />
  );
}