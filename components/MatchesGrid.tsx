'use client';

import { motion } from 'framer-motion';
import { getPosterUrl } from '@/lib/tmdb';
import { Star, Play } from 'lucide-react';
import { useState } from 'react';

interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  content_type: 'movie' | 'tv';
  popularity: number;
}

interface MatchesGridProps {
  matches: ContentItem[];
}

export default function MatchesGrid({ matches }: MatchesGridProps) {
  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="text-7xl mb-6">😅</div>
        <h3 className="text-2xl font-bold text-white mb-3">No matches yet</h3>
        <p className="text-base" style={{ color: '#A1A1AA' }}>
          Keep swiping or try different picks
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {matches.map((item, index) => (
        <MatchCard key={item.id} content={item} index={index} isTopPick={index === 0} />
      ))}
    </div>
  );
}

function MatchCard({ content, index, isTopPick }: { content: ContentItem; index: number; isTopPick: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -8 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isTopPick && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-bold"
             style={{ 
               backgroundColor: '#E50914',
               color: 'white'
             }}>
          TOP PICK
        </div>
      )}
      
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden"
           style={{ 
             backgroundColor: '#14151A',
             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
           }}>
        <img
          src={getPosterUrl(content.poster_path, 'w500')}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex flex-col justify-end p-4"
          style={{
            background: 'linear-gradient(to top, rgba(11, 11, 15, 0.95) 0%, rgba(11, 11, 15, 0.7) 50%, transparent 100%)'
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{content.rating}</span>
            <span className="text-xs font-medium uppercase px-1.5 py-0.5 rounded ml-auto"
                  style={{ 
                    backgroundColor: 'rgba(229, 9, 20, 0.2)',
                    color: '#E50914'
                  }}>
              {content.content_type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
          
          <h3 className="text-sm font-bold text-white leading-tight mb-2 line-clamp-2">
            {content.title}
          </h3>
          
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-3">
            {content.overview || 'No description available'}
          </p>

          <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-medium text-sm transition-all"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#0B0B0F'
                  }}>
            <Play className="w-4 h-4 fill-current" />
            Watch Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
