'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

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
  const [selectedMatch, setSelectedMatch] = useState<ContentItem | null>(null);

  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-[#18181B] rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-10 h-10 text-[#A1A1AA]" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No matches yet</h2>
        <p className="text-[#A1A1AA] text-lg">
          Keep swiping to find something you both like
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedMatch(match)}
            className={`relative cursor-pointer group ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            {/* Best Match Badge */}
            {index === 0 && (
              <div className="absolute top-3 left-3 z-10 bg-[#F5C518] text-[#09090B] px-3 py-1 rounded-full text-xs font-bold">
                Best Match
              </div>
            )}

            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#18181B]">
              <Image
                src={`https://image.tmdb.org/t/p/w500${match.poster_path}`}
                alt={match.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                  <h3 className="font-bold text-sm line-clamp-2 leading-tight">
                    {match.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <Star className="w-3 h-3 fill-[#F5C518] text-[#F5C518]" />
                    <span className="text-[#F5C518] font-semibold">
                      {match.rating.toFixed(1)}
                    </span>
                  </div>
                  {match.overview && (
                    <p className="text-xs text-[#D4D4D8] line-clamp-2">
                      {match.overview}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        size="md"
      >
        {selectedMatch && (
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${selectedMatch.poster_path}`}
                  alt={selectedMatch.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedMatch.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#F5C518] text-[#F5C518]" />
                      <span className="text-[#F5C518] font-semibold">
                        {selectedMatch.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="capitalize">{selectedMatch.content_type}</span>
                  </div>
                </div>

                {selectedMatch.overview && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#A1A1AA] mb-2">Overview</h3>
                    <p className="text-[#D4D4D8] leading-relaxed">
                      {selectedMatch.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
