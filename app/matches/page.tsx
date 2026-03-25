'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MatchesGrid from '@/components/MatchesGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  content_type: 'movie' | 'tv';
  popularity: number;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const fetchMatches = async (uid: string, rid: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/matches?userId=${uid}&roomId=${rid}`);
      const { matches: fetchedMatches } = await response.json();
      setMatches(fetchedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedRoomId = localStorage.getItem('roomId');

    if (!storedUserId || !storedRoomId) {
      router.push('/');
      return;
    }

    setUserId(storedUserId);
    setRoomId(storedRoomId);
    fetchMatches(storedUserId, storedRoomId);
  }, [router]);

  const handleRefresh = () => {
    if (userId && roomId) {
      fetchMatches(userId, roomId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/swipe')}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Matches</h1>
              <p className="text-sm text-gray-400">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {matches.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-center">
              🎉 You both liked these! Time to pick one and start watching.
            </p>
          </div>
        )}

        <MatchesGrid matches={matches} />
      </main>

      {/* Footer */}
      {matches.length > 0 && (
        <div className="p-4 bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-gray-400">
              Tip: Share your room code <span className="font-bold text-white">{roomId}</span> with friends to find more matches!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
