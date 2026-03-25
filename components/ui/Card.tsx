'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.03 } : {}}
      className={`bg-[#111113] rounded-2xl overflow-hidden ${className}`}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
