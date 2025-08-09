'use client';

import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-2xl shadow-[var(--shadow-card)] ${className}`}
      {...props}
    />
  );
}


