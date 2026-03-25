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
      {/* Header */}
      <header 
        className="px-4 sm:px-6 py-5"
        style={{ 
          backgroundColor: 'rgba(11, 11, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="p-3 rounded-full transition-all"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        {!searched ? (
          // Search Form
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Hero */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
                  style={{ 
                    backgroundColor: '#E50914',
                    boxShadow: '0 20px 40px rgba(229, 9, 20, 0.3)'
                  }}
                >
                  <Users className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight text-white">
                Compare with<br />a Friend
              </h1>
              
              <p className="text-base sm:text-lg" style={{ color: '#A1A1AA' }}>
                Enter two email addresses to see<br />what you both liked
              </p>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl p-6 sm:p-8"
              style={{ 
                backgroundColor: '#14151A',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div className="space-y-6">
                {/* Email 1 */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-white">
                    First Person
                  </label>
                  <input
                    type="email"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    placeholder="person1@example.com"
                    className="w-full px-6 py-4 rounded-2xl text-base font-medium transition-all duration-200 focus:outline-none"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '2px solid transparent',
                      color: '#FFFFFF'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.borderColor = '#E50914';
                      e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* VS Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  </div>
                  <div className="relative flex justify-center">
                    <span 
                      className="px-4 text-sm font-bold"
                      style={{ 
                        backgroundColor: '#14151A',
                        color: '#E50914'
                      }}
                    >
                      vs
                    </span>
                  </div>
                </div>

                {/* Email 2 */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-white">
                    Second Person
                  </label>
                  <input
                    type="email"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    placeholder="person2@example.com"
                    className="w-full px-6 py-4 rounded-2xl text-base font-medium transition-all duration-200 focus:outline-none"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '2px solid transparent',
                      color: '#FFFFFF'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.target.style.borderColor = '#E50914';
                      e.target.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl text-sm font-medium"
                    style={{ 
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      color: '#E50914'
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompare}
                  disabled={loading}
                  className="w-full py-5 rounded-2xl font-bold text-base transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3"
                  style={{ 
                    backgroundColor: '#E50914',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(229, 9, 20, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = '#F40612';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(229, 9, 20, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E50914';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(229, 9, 20, 0.3)';
                  }}
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
          // Results View
          <div className="w-full max-w-6xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                    Your Matches 🎬
                  </h1>
                  <p className="text-base sm:text-lg" style={{ color: '#A1A1AA' }}>
                    Things you both liked
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="p-3 rounded-full transition-all self-start sm:self-auto"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* User Comparison */}
              <div className="max-w-3xl mx-auto mb-8">
                <div 
                  className="p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  style={{ 
                    backgroundColor: matches.length > 0 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(161, 161, 170, 0.1)',
                    border: `2px solid ${matches.length > 0 
                      ? 'rgba(34, 197, 94, 0.3)' 
                      : 'rgba(161, 161, 170, 0.2)'}`,
                    boxShadow: matches.length > 0
                      ? '0 20px 60px rgba(34, 197, 94, 0.15)'
                      : '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl"
                      style={{ 
                        backgroundColor: '#E50914',
                        boxShadow: '0 8px 24px rgba(229, 9, 20, 0.3)'
                      }}
                    >
                      {users[0].name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg">{users[0].name}</p>
                      <p className="text-xs sm:text-sm truncate max-w-[150px]" style={{ color: '#A1A1AA' }}>{users[0].email}</p>
                    </div>
                  </div>

                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl"
                    style={{ 
                      backgroundColor: matches.length > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(161, 161, 170, 0.2)',
                      color: matches.length > 0 ? '#22c55e' : '#A1A1AA'
                    }}
                  >
                    {matches.length > 0 ? '✓' : '×'}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl"
                      style={{ 
                        backgroundColor: '#E50914',
                        boxShadow: '0 8px 24px rgba(229, 9, 20, 0.3)'
                      }}
                    >
                      {users[1].name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base sm:text-lg">{users[1].name}</p>
                      <p className="text-xs sm:text-sm truncate max-w-[150px]" style={{ color: '#A1A1AA' }}>{users[1].email}</p>
                    </div>
                  </div>
                </div>

                {/* Match Count */}
                <div className="text-center mt-6">
                  <p 
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: matches.length > 0 ? '#22c55e' : '#A1A1AA' }}
                  >
                    {matches.length > 0 
                      ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'} found! 🎉`
                      : "No matches yet 😅 Keep swiping!"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Loading */}
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
