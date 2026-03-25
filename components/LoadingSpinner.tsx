'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
             style={{ borderColor: '#E50914', borderTopColor: 'transparent' }}
        />
      </div>
      <p className="text-sm font-medium" style={{ color: '#A1A1AA' }}>Loading...</p>
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
