'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/ui/Container';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Structure the user object properly
      const user = {
        id: data.userId,
        name: data.name,
        email: data.email
      };

      localStorage.setItem('user', JSON.stringify(user));
      router.push('/swipe');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Hero Section */}
          <div className="mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-balance"
            >
              Pick something great together
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl sm:text-2xl text-[#A1A1AA] leading-relaxed text-balance max-w-2xl mx-auto"
            >
              Swipe through movies and shows.
              <br />
              We'll find your overlap.
            </motion.p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-5"
          >
            <Input
              label="Your name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Your email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              disabled={loading}
              error={error}
            />

            <Button
              onClick={handleStart}
              disabled={loading}
              fullWidth
              size="lg"
            >
              {loading ? 'Starting...' : 'Start Swiping'}
            </Button>
          </motion.div>

          {/* Footer Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16"
          >
            <button
              onClick={() => router.push('/compare')}
              className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-sm font-medium group"
            >
              Already have matches? Compare with a friend
              <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
