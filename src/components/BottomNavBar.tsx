import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BottomNavBar: React.FC = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/prompts', icon: Compass, label: 'Prompts' },
    { path: '/instructions', icon: BookOpen, label: 'How-To' },
    ...(isAdmin ? [{ path: '/admin', icon: User, label: 'Admin' }] : []),
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 md:px-4 md:py-3 md:flex-row md:w-auto md:rounded-full ${
      isActive ? 'text-accent md:bg-sky-100' : 'text-slate-500 hover:text-accent'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-t border-light shadow-t-lg z-50 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-lg md:bottom-5 md:rounded-full md:border md:shadow-soft-lg">
      <div className="flex justify-around items-stretch h-full md:gap-2 md:p-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={getLinkClass(path)}>
            <Icon size={24} strokeWidth={location.pathname === path ? 2.5 : 2} />
            <span className="text-xs font-medium md:text-sm md:font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
