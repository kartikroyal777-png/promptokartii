import React from 'react';
import { motion } from 'framer-motion';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', icon, disabled = false, type = 'button' }) => {
  const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 md:px-6 md:py-3 md:text-base disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-sky-500 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 disabled:bg-accent',
    secondary: 'bg-dark text-white hover:bg-slate-800 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 disabled:bg-dark',
    outline: 'bg-transparent border-2 border-light text-dark hover:bg-slate-100 hover:border-slate-300 disabled:bg-transparent',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
