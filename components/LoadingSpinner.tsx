'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-4 border-[#27272A] border-t-[#F5C518] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden skeleton"
         style={{ 
           backgroundColor: '#14151A',
           boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)'
         }}>
      <div className="w-full aspect-[2/3] skeleton" />
    </div>
  );
}
