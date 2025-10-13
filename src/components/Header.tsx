import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `text-dark font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `text-2xl font-bold ${navLinkClasses({ isActive })}`;

  const navLinks = (
    <>
      <NavLink to="/" className={isMenuOpen ? mobileNavLinkClasses : navLinkClasses}>Home</NavLink>
      <NavLink to="/prompts" className={isMenuOpen ? mobileNavLinkClasses : navLinkClasses}>Prompts</NavLink>
      {user && isAdmin ? (
        <>
          <NavLink to="/admin" className={isMenuOpen ? mobileNavLinkClasses : navLinkClasses}>Dashboard</NavLink>
          <Button onClick={signOut} variant="secondary" className="px-4 py-2 text-sm mt-4 md:mt-0" icon={<LogOut size={16}/>}>
            Logout
          </Button>
        </>
      ) : (
        <NavLink to="/login" className={isMenuOpen ? mobileNavLinkClasses : navLinkClasses}>Admin</NavLink>
      )}
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold text-dark font-display">SeedreamPrompts</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks}
            </nav>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                <Menu className="w-7 h-7 text-dark" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[99] md:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-[100] md:hidden shadow-2xl"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-12">
                  <Link to="/" className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <span className="text-xl font-bold text-dark font-display">Seedream</span>
                  </Link>
                  <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                    <X className="w-7 h-7 text-dark" />
                  </button>
                </div>
                <nav className="flex flex-col items-start gap-8">
                  {navLinks}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
