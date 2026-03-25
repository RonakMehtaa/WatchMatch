'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Content {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
}

interface SwipeCardProps {
  content: Content;
  onSwipe: (direction: 'left' | 'right') => void;
  style?: any;
}

export default function SwipeCard({ content, onSwipe, style }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

  const year = content.release_date?.split('-')[0] || content.first_air_date?.split('-')[0] || '';
  const rating = content.vote_average ? content.vote_average.toFixed(1) : 'N/A';

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        ...style
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Like Overlay */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute inset-0 bg-green-500/20 rounded-2xl z-10 pointer-events-none flex items-center justify-center"
      >
        <div className="text-green-500 text-6xl font-black rotate-12 border-4 border-green-500 px-8 py-4 rounded-xl">
          LIKE
        </div>
      </motion.div>

      {/* Pass Overlay */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute inset-0 bg-red-500/20 rounded-2xl z-10 pointer-events-none flex items-center justify-center"
      >
        <div className="text-red-500 text-6xl font-black -rotate-12 border-4 border-red-500 px-8 py-4 rounded-xl">
          PASS
        </div>
      </motion.div>

      {/* Card */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        {/* Poster Image */}
        <Image
          src={`https://image.tmdb.org/t/p/w500${content.poster_path}`}
          alt={content.title}
          fill
          className="object-cover"
          priority
        />

        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <h2 className="text-3xl font-bold text-white leading-tight">
            {content.title}
          </h2>

          <div className="flex items-center gap-4 text-sm text-[#A1A1AA]">
            {year && <span>{year}</span>}
            {rating !== 'N/A' && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#F5C518] text-[#F5C518]" />
                <span className="text-[#F5C518] font-semibold">{rating}</span>
              </div>
            )}
            <span className="capitalize">{content.media_type}</span>
          </div>

          {content.overview && (
            <p className="text-sm text-[#D4D4D8] line-clamp-2 leading-relaxed">
              {content.overview}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
