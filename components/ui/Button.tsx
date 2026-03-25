'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, children, className = '', disabled, onClick, type = 'button', ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:ring-offset-2 focus:ring-offset-[#09090B] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#F5C518] text-[#09090B] hover:bg-[#F5C518]/90',
      secondary: 'bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A] border border-[#27272A]',
      ghost: 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B]'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };
    
    const width = fullWidth ? 'w-full' : '';
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
