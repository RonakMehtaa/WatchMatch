'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard, { SwipeButtons } from '@/components/SwipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LogOut, SlidersHorizontal, X } from 'lucide-react';
import { PROVIDER_IDS, GENRE_IDS } from '@/lib/tmdb';

interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  content_type: 'movie' | 'tv';
  popularity: number;
}

export default function SwipePage() {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserId) {
      router.push('/');
      return;
    }

    setUserId(storedUserId);
    setUserName(storedUserName);
  }, [router]);

  const fetchContent = useCallback(async () => {
    try {
      if (!userId) return;

      setLoading(true);

      const swipeResponse = await fetch(`/api/user-swipes?userId=${userId}`);
      const { data: seenContent } = await swipeResponse.json();
      const seenIds = new Set(seenContent?.map((s: any) => s.content_id) || []);

      console.log('Seen content IDs:', Array.from(seenIds));

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '200',
      });

      if (selectedProviders.length > 0) {
        params.append('providers', selectedProviders.join(','));
      }

      if (selectedGenres.length > 0) {
        params.append('genres', selectedGenres.join(','));
      }

      const response = await fetch(`/api/content?${params.toString()}`);
      const { content: fetchedContent } = await response.json();

      console.log('Total fetched:', fetchedContent.length);

      const unseenContent = fetchedContent.filter((item: ContentItem) => !seenIds.has(item.id));

      console.log('Unseen content:', unseenContent.length);

      setContent(unseenContent);
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  }, [userId, page, selectedProviders, selectedGenres]);

  useEffect(() => {
    if (userId) {
      fetchContent();
    }
  }, [userId, fetchContent]);

  const preloadNextCards = useCallback(() => {
    for (let i = currentIndex + 1; i < Math.min(currentIndex + 6, content.length); i++) {
      if (content[i]?.poster_path) {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/original${content[i].poster_path}`;
      }
    }
  }, [currentIndex, content]);

  useEffect(() => {
    preloadNextCards();
  }, [preloadNextCards]);

  const handleSwipe = async (liked: boolean) => {
    if (!userId || !content[currentIndex]) return;

    try {
      await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentId: content[currentIndex].id,
          liked,
        }),
      });

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error saving swipe:', error);
    }
  };

  const handleViewMatches = () => {
    router.push('/compare');
  };

  const handleLeaveRoom = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleApplyFilters = () => {
    setContent([]);
    setCurrentIndex(0);
    setPage(1);
    fetchContent();
    setShowFilters(false);
  };

  const toggleProvider = (providerId: number) => {
    setSelectedProviders(prev =>
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedProviders([]);
    setSelectedGenres([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B0B0F' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (currentIndex >= content.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#0B0B0F' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">You're done for now</h2>
          <p className="text-lg mb-8" style={{ color: '#A1A1AA' }}>
            {selectedProviders.length > 0 || selectedGenres.length > 0
              ? 'Try changing your filters to see more content.'
              : 'Check back later for fresh picks.'}
          </p>
          <div className="flex flex-col gap-3">
            {(selectedProviders.length > 0 || selectedGenres.length > 0) && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(true)}
                className="px-8 py-4 rounded-xl font-bold text-white transition-all"
                style={{ backgroundColor: '#E50914' }}
              >
                Adjust Filters
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewMatches}
              className="px-8 py-4 rounded-xl font-medium text-white transition-all"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Compare with Friend
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0B0B0F' }}>
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4"
              style={{ 
                backgroundColor: 'rgba(20, 21, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
        <div>
          <p className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
            Hey, {userName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(true)}
            className="p-2.5 rounded-xl transition-all relative"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
            {(selectedProviders.length > 0 || selectedGenres.length > 0) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: '#E50914' }} />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaveRoom}
            className="p-2.5 rounded-xl transition-all"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <LogOut className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Card Stack */}
        <div className="relative w-full max-w-sm aspect-[2/3] mb-6">
          <AnimatePresence>
            {content.slice(currentIndex, currentIndex + 3).map((item, index) => (
              <SwipeCard
                key={item.id}
                content={item}
                onSwipe={handleSwipe}
                isTop={index === 0}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 3 - index,
                  scale: 1 - index * 0.03,
                  y: index * 8,
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Swipe Buttons */}
        <SwipeButtons
          onLike={() => handleSwipe(true)}
          onDislike={() => handleSwipe(false)}
        />

        {/* Progress */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
            {currentIndex + 1} of {content.length}
          </p>
          {(selectedProviders.length > 0 || selectedGenres.length > 0) && (
            <p className="text-xs mt-1" style={{ color: '#E50914' }}>
              {selectedProviders.length + selectedGenres.length} filters active
            </p>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-6" style={{ backgroundColor: 'rgba(20, 21, 26, 0.8)' }}>
        <button
          onClick={handleViewMatches}
          className="w-full py-4 rounded-xl font-bold text-white transition-all duration-200"
          style={{ backgroundColor: '#E50914' }}
        >
          Compare with Friend
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 overflow-y-auto"
              style={{ backgroundColor: '#14151A' }}
            >
              {/* Filter Header */}
              <div className="sticky top-0 p-6 flex items-center justify-between"
                   style={{ 
                     backgroundColor: 'rgba(20, 21, 26, 0.95)',
                     backdropFilter: 'blur(20px)',
                     borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                   }}>
                <h2 className="text-2xl font-bold text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-xl transition-all"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Streaming Services */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Streaming Services</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(PROVIDER_IDS).map(([name, id]) => (
                      <button
                        key={id}
                        onClick={() => toggleProvider(id)}
                        className="p-4 rounded-xl font-medium text-sm transition-all"
                        style={selectedProviders.includes(id) 
                          ? { 
                              backgroundColor: 'rgba(229, 9, 20, 0.2)',
                              border: '2px solid #E50914',
                              color: 'white'
                            }
                          : { 
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '2px solid rgba(255, 255, 255, 0.1)',
                              color: '#A1A1AA'
                            }
                        }
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(GENRE_IDS).map(([name, id]) => (
                      <button
                        key={id}
                        onClick={() => toggleGenre(id)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                        style={selectedGenres.includes(id)
                          ? { 
                              backgroundColor: 'rgba(229, 9, 20, 0.2)',
                              border: '1px solid #E50914',
                              color: 'white'
                            }
                          : { 
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#A1A1AA'
                            }
                        }
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Footer */}
              <div className="sticky bottom-0 p-6 space-y-3"
                   style={{ 
                     backgroundColor: 'rgba(20, 21, 26, 0.95)',
                     backdropFilter: 'blur(20px)',
                     borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                   }}>
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-4 rounded-xl font-bold text-white transition-all"
                  style={{ backgroundColor: '#E50914' }}
                >
                  Apply Filters
                </button>
                {(selectedProviders.length > 0 || selectedGenres.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-4 rounded-xl font-medium text-white transition-all"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
