import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, Upload, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import MonetizationGuideModal from './MonetizationGuideModal';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navLinkClasses = "text-slate-600 hover:text-dark font-medium transition-colors";
  const activeNavLinkClasses = "text-dark";

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`;

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/80 backdrop-blur-lg border border-light rounded-xl shadow-soft max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-dark font-display" style={{ fontWeight: 600 }}>
              Dollar<span className="text-accent">Prompt</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/prompts" className={getNavLinkClass}>Prompts</NavLink>
            <NavLink to="/instructions" className={getNavLinkClass}>Instructions</NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="px-3 py-2 md:px-3 md:py-2" aria-label="Monetization Guide">
              <DollarSign size={18} className="text-amber-500"/>
              <span className="hidden sm:inline ml-2">Monetize</span>
            </Button>
            <Button onClick={() => navigate('/upload')} variant="primary" className="px-3 py-2 md:px-3 md:py-2" aria-label="Upload Prompt">
              <Upload size={18} />
              <span className="hidden sm:inline ml-2">Upload</span>
            </Button>
          </div>
        </div>
      </motion.header>
      <MonetizationGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
