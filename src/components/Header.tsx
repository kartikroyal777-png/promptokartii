import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold text-dark font-display">SeedreamPrompts</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={({ isActive }) => `text-dark font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`}>Home</NavLink>
            <NavLink to="/prompts" className={({ isActive }) => `text-dark font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`}>Prompts</NavLink>
            {user && isAdmin ? (
              <>
                <NavLink to="/admin" className={({ isActive }) => `text-dark font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`}>Dashboard</NavLink>
                <Button onClick={signOut} variant="secondary" className="px-4 py-2 text-sm" icon={<LogOut size={16}/>}>
                  Logout
                </Button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `text-dark font-medium hover:text-accent transition-colors ${isActive ? 'text-accent' : ''}`}>Admin</NavLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
