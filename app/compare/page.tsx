'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MatchesGrid from '@/components/MatchesGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Users, Search, X } from 'lucide-react';

interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  content_type: 'movie' | 'tv';
  popularity: number;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export default function ComparePage() {
  const router = useRouter();
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [matches, setMatches] = useState<ContentItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleCompare = async () => {
    if (!email1.trim() || !email2.trim()) {
      setError('Please enter both email addresses');
      return;
    }

    if (email1.trim() === email2.trim()) {
      setError('Please enter two different email addresses');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const response = await fetch(`/api/compare?email1=${encodeURIComponent(email1.trim())}&email2=${encodeURIComponent(email2.trim())}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setMatches(data.matches || []);
      setUsers(data.users || []);
      setSearched(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to compare. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail1('');
    setEmail2('');
    setMatches([]);
    setUsers([]);
    setError('');
    setSearched(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0B0B0F' }}>
      {/* Minimal Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
              style={{ 
                backgroundColor: 'rgba(20, 21, 26, 0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
        <div className="max-w-7xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="p-2.5 rounded-xl transition-all"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        {!searched ? (
          // Search Form - Centered
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {/* Heading */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" 
                     style={{ backgroundColor: '#E50914' }}>
                  <Users className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Compare with a Friend
              </h1>
              <p className="text-lg" style={{ color: '#A1A1AA' }}>
                Enter two email addresses to see what you both liked
              </p>
            </div>

            {/* Input Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-8 shadow-2xl"
              style={{ 
                backgroundColor: '#14151A',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="space-y-5">
                {/* Email 1 */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    First Person
                  </label>
                  <input
                    type="email"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    placeholder="person1@example.com"
                    className="w-full px-5 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  />
                </div>

                {/* Divider with "vs" */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm font-bold" style={{ backgroundColor: '#14151A', color: '#E50914' }}>
                      vs
                    </span>
                  </div>
                </div>

                {/* Email 2 */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Second Person
                  </label>
                  <input
                    type="email"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    placeholder="person2@example.com"
                    className="w-full px-5 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                    onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl text-sm"
                    style={{ 
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      color: '#E50914'
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Compare Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompare}
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#E50914' }}
                >
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Find Matches
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Results View - Centered with max width
          <div className="w-full max-w-7xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Your Matches</h1>
                  <p className="text-base" style={{ color: '#A1A1AA' }}>
                    Movies and shows you both liked
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* User Comparison Card - Centered */}
              <div className="max-w-3xl mx-auto">
                <div className="p-6 rounded-2xl flex items-center justify-center gap-4"
                     style={{ 
                       backgroundColor: matches.length > 0 
                         ? 'rgba(34, 197, 94, 0.1)' 
                         : 'rgba(161, 161, 170, 0.1)',
                       border: `1px solid ${matches.length > 0 
                         ? 'rgba(34, 197, 94, 0.3)' 
                         : 'rgba(161, 161, 170, 0.2)'}`
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                         style={{ backgroundColor: '#E50914' }}>
                      {users[0].name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{users[0].name}</p>
                      <p className="text-xs" style={{ color: '#A1A1AA' }}>{users[0].email}</p>
                    </div>
                  </div>

                  <div className="px-6">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-2xl"
                         style={{ 
                           backgroundColor: matches.length > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(161, 161, 170, 0.2)',
                           color: matches.length > 0 ? '#22c55e' : '#A1A1AA'
                         }}>
                      {matches.length > 0 ? '✓' : '×'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                         style={{ backgroundColor: '#E50914' }}>
                      {users[1].name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{users[1].name}</p>
                      <p className="text-xs" style={{ color: '#A1A1AA' }}>{users[1].email}</p>
                    </div>
                  </div>
                </div>

                {/* Match Count */}
                <div className="text-center mt-4">
                  <p className="text-lg font-bold" 
                     style={{ color: matches.length > 0 ? '#22c55e' : '#A1A1AA' }}>
                    {matches.length > 0 
                      ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} found! 🎉`
                      : "No matches yet. Keep swiping!"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {/* Matches Grid */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MatchesGrid matches={matches} />
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
