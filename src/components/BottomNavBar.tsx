import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User, BookOpen, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BottomNavBar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/prompts', icon: Compass, label: 'Prompts' },
    ...(user ? [{ path: '/earn', icon: Gift, label: 'Earn' }] : []),
    { path: '/instructions', icon: BookOpen, label: 'How-To' },
    ...(isAdmin ? [{ path: '/admin', icon: User, label: 'Admin' }] : []),
  ];

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-accent' : 'text-slate-500 hover:text-accent'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-light shadow-t-lg md:hidden z-50">
      <div className="flex justify-around items-stretch h-full">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={getLinkClass(path)}>
            <Icon size={24} strokeWidth={location.pathname === path ? 2.5 : 2} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
