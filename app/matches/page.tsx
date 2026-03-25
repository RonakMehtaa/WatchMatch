'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MatchesGrid from '@/components/MatchesGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import { ArrowLeft } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Container size="full" className="py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-6 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/swipe')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Swiping
            </Button>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Your Matches
          </h1>
          <p className="text-xl text-[#A1A1AA]">
            {matches.length} {matches.length === 1 ? 'title' : 'titles'} you both liked
          </p>
        </motion.div>

        {/* Matches Grid */}
        <MatchesGrid matches={matches} />
      </Container>
    </div>
  );
}
