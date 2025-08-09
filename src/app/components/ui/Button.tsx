'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'h-10 px-4 rounded-2xl focus:outline-none focus:ring-2';
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-accent text-black focus:ring-[var(--ring-focus)] hover:brightness-110',
    outline: 'bg-transparent border border-border text-fg hover:bg-muted focus:ring-[var(--ring-focus)]',
    ghost: 'bg-transparent text-fg hover:bg-muted',
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}


