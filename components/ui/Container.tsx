'use client';

import { ReactNode } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export default function Container({ children, size = 'md', className = '' }: ContainerProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    full: 'max-w-7xl'
  };
  
  return (
    <div className={`mx-auto w-full px-6 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
