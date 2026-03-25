'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { X, Heart, Sparkles } from 'lucide-react';
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

interface Match {
  content_id: number;
  title: string;
  poster_path: string;
  matched_with: string;
}

export default function SwipePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<Match | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || userData === 'undefined') {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadContent();
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router]);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContent(data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user || currentIndex >= content.length) return;

    const currentContent = content[currentIndex];
    const liked = direction === 'right';

    try {
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          content_id: currentContent.id,
          liked,
        }),
      });

      const data = await response.json();

      if (data.match) {
        setMatchModal({
          content_id: currentContent.id,
          title: currentContent.title,
          poster_path: currentContent.poster_path,
          matched_with: data.matched_with,
        });
      }

      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error swiping:', error);
    }
  };

  const currentContent = content[currentIndex];
  const hasMore = currentIndex < content.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header - Minimal */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-[#A1A1AA]">
              {user?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/matches')}
          >
            View Matches
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full px-6 py-20">
        {hasMore ? (
          <div className="relative w-full max-w-[420px] h-[600px]">
            <AnimatePresence>
              {content.slice(currentIndex, currentIndex + 3).map((item, index) => (
                <SwipeCard
                  key={item.id}
                  content={item}
                  onSwipe={index === 0 ? handleSwipe : () => {}}
                  style={{
                    zIndex: 3 - index,
                    scale: 1 - index * 0.05,
                    y: index * 10,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 bg-[#18181B] rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-[#F5C518]" />
            </div>
            <h2 className="text-4xl font-bold mb-4">All done!</h2>
            <p className="text-[#A1A1AA] mb-10 text-lg leading-relaxed">
              You've swiped through all available content.
            </p>
            <Button onClick={() => router.push('/matches')} size="lg">
              View Your Matches
            </Button>
          </motion.div>
        )}
      </div>

      {/* Action Buttons - Fixed Bottom */}
      {hasMore && (
        <div className="absolute bottom-0 left-0 right-0 pb-10 flex items-center justify-center gap-6 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-[#18181B]/80 backdrop-blur-sm border border-[#27272A] hover:border-red-500/50 hover:bg-red-500/10 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <X className="w-7 h-7 text-red-500" strokeWidth={2.5} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-[#18181B]/80 backdrop-blur-sm border border-[#27272A] hover:border-green-500/50 hover:bg-green-500/10 rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <Heart className="w-7 h-7 text-green-500" strokeWidth={2.5} />
          </motion.button>
        </div>
      )}

      {/* Match Modal */}
      <Modal
        isOpen={!!matchModal}
        onClose={() => setMatchModal(null)}
        size="sm"
      >
        {matchModal && (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold mb-3">It's a Match!</h2>
            <p className="text-[#A1A1AA] mb-10 text-lg">
              You and <span className="text-white font-semibold">{matchModal.matched_with}</span> both liked this
            </p>

            <div className="relative w-48 aspect-[2/3] mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={`https://image.tmdb.org/t/p/w500${matchModal.poster_path}`}
                alt={matchModal.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-2xl font-bold mb-10">{matchModal.title}</h3>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setMatchModal(null)}
              >
                Keep Swiping
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setMatchModal(null);
                  router.push('/matches');
                }}
              >
                View All Matches
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
