'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const { userId, error: loginError } = await response.json();

      if (loginError) {
        setError(loginError);
        setIsLoading(false);
        return;
      }

      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userEmail', email.trim());

      router.push('/swipe');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCompare = () => {
    router.push('/compare');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#0B0B0F' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
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
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Find something you'll <br />both love
          </h1>
          <p className="text-lg" style={{ color: '#A1A1AA' }}>
            Swipe movies and shows.<br />We'll find your perfect match.
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl p-8 shadow-2xl"
          style={{ 
            backgroundColor: '#14151A',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
              />
            </div>
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-5 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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

            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E50914' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C40812'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E50914'}
            >
              {isLoading ? 'Loading...' : 'Start Swiping'}
            </motion.button>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm" style={{ backgroundColor: '#14151A', color: '#A1A1AA' }}>
                  or
                </span>
              </div>
            </div>

            {/* Secondary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompare}
              className="w-full py-4 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <Users className="w-5 h-5" />
              Compare with Friend
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm"
          style={{ color: '#A1A1AA' }}
        >
          <p>Your swipes are saved. Come back anytime.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
