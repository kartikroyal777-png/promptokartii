import React from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', icon }) => {
  const baseClasses = 'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 md:px-6 md:py-3 md:text-base';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-sky-500 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5',
    secondary: 'bg-dark text-white hover:bg-slate-800 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-light text-dark hover:bg-slate-100 hover:border-slate-300',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
