import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, Coins, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            <span className="text-xl md:text-2xl font-bold text-dark font-display">Seedream<span className="text-accent">Prompts</span></span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <Link to="/earn" className="flex items-center gap-2 bg-amber-100 text-amber-700 font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full cursor-pointer hover:bg-amber-200 transition-colors">
                  <Coins size={16} />
                  <span className="text-sm">{profile?.credits ?? 0}</span>
                </Link>
                <div className="relative" ref={settingsRef}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-dark transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                  <AnimatePresence>
                    {isSettingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-soft-lg border border-light overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            signOut();
                            setIsSettingsOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-dark transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <NavLink to="/auth">
                <Button variant="primary">Login / Sign Up</Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
