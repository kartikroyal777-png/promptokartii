import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, PlusSquare, DollarSign } from 'lucide-react';

interface BottomNavBarProps {
  onMonetizeClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onMonetizeClick }) => {
  const commonClasses = "flex flex-col items-center justify-center gap-1 text-slate-500 transition-colors w-full h-full";
  const activeClasses = "text-accent";

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${commonClasses} ${isActive ? activeClasses : 'hover:bg-slate-100'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-light shadow-t-lg z-40">
      <div className="flex justify-around h-20">
        <NavLink to="/" className={getLinkClass} end>
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </NavLink>
        <NavLink to="/prompts" className={getLinkClass}>
          <LayoutGrid size={24} />
          <span className="text-xs font-medium">Explore</span>
        </NavLink>
        <NavLink to="/upload" className={getLinkClass}>
          <PlusSquare size={24} />
          <span className="text-xs font-medium">Upload</span>
        </NavLink>
        <button onClick={onMonetizeClick} className={`${commonClasses} hover:bg-slate-100`}>
          <DollarSign size={24} />
          <span className="text-xs font-medium">Monetize</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;
