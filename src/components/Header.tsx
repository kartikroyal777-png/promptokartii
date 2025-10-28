import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Upload, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

interface HeaderProps {
  onMonetizeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMonetizeClick }) => {
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/80 backdrop-blur-lg border border-light rounded-2xl shadow-soft px-4 sm:px-6"
    >
      <div className="flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-accent" />
          <span className="text-xl md:text-2xl font-bold text-dark font-display" style={{ fontWeight: 600 }}>
            Dollar<span className="text-accent">Prompt</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onMonetizeClick}
            className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-dark transition-colors"
            aria-label="How to monetize prompts"
          >
            <DollarSign size={20} />
          </button>
          
          {/* Desktop Upload Button */}
          <Button onClick={() => navigate('/upload')} variant="primary" icon={<Upload size={16}/>} className="hidden md:flex">
            Upload Prompt
          </Button>

          {/* Mobile Upload Button */}
          <button 
            onClick={() => navigate('/upload')}
            className="md:hidden p-2.5 rounded-full text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-dark transition-colors"
            aria-label="Upload prompt"
          >
            <Upload size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
