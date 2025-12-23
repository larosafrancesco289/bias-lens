'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-accent text-white shadow-lg hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.98]',
    secondary: 'bg-surface text-fg border border-border hover:border-accent hover:text-accent shadow-sm active:scale-[0.98]',
    outline: 'bg-transparent border-2 border-border text-fg hover:border-accent hover:text-accent active:scale-[0.98]',
    ghost: 'bg-transparent text-fg hover:bg-muted active:scale-[0.98]',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-10 px-5 text-sm rounded-xl',
    lg: 'h-12 px-8 text-base rounded-2xl',
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}