'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { getPosterUrl } from '@/lib/tmdb';
import { X, Heart, Star } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  content_type: 'movie' | 'tv';
}

interface SwipeCardProps {
  content: ContentItem;
  onSwipe: (liked: boolean) => void;
  style?: React.CSSProperties;
  isTop?: boolean;
}

export default function SwipeCard({ content, onSwipe, style, isTop = false }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 150) {
      setExitX(info.offset.x > 0 ? 1000 : -1000);
      onSwipe(info.offset.x > 0);
    }
  };

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        ...style,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden" 
           style={{ 
             backgroundColor: '#14151A',
             boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6)'
           }}>
        {/* Poster Image */}
        <div className="absolute inset-0">
          <img
            src={getPosterUrl(content.poster_path, 'original')}
            alt={content.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          
          {/* Bottom Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(11, 11, 15, 0.95) 0%, rgba(11, 11, 15, 0.6) 30%, transparent 60%)'
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-3xl font-bold text-white leading-tight pr-4 flex-1">
              {content.title}
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-white">{content.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded"
                  style={{ 
                    backgroundColor: 'rgba(229, 9, 20, 0.2)',
                    color: '#E50914'
                  }}>
              {content.content_type === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {content.overview || 'No description available'}
          </p>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-12 left-8 text-6xl font-black px-6 py-3 rounded-2xl pointer-events-none"
          style={{ 
            opacity: nopeOpacity,
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '3px solid rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)',
            rotate: -20
          }}
        >
          NOPE
        </motion.div>
        
        <motion.div
          className="absolute top-12 right-8 text-6xl font-black px-6 py-3 rounded-2xl pointer-events-none"
          style={{ 
            opacity: likeOpacity,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '3px solid rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)',
            rotate: 20
          }}
        >
          LIKE
        </motion.div>
      </div>
    </motion.div>
  );
}

export function SwipeButtons({ onLike, onDislike }: { onLike: () => void; onDislike: () => void }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDislike}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid rgba(239, 68, 68, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
          e.currentTarget.style.borderColor = 'rgb(239, 68, 68)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }}
      >
        <X className="w-7 h-7 text-red-500" strokeWidth={3} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ 
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid rgba(34, 197, 94, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.25)';
          e.currentTarget.style.borderColor = 'rgb(34, 197, 94)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
        }}
      >
        <Heart className="w-7 h-7 text-green-500" fill="currentColor" strokeWidth={0} />
      </motion.button>
    </div>
  );
}
