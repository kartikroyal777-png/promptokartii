import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, placeholder = 'Search prompts...', className = '' }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleFocus = () => {
    const popunderAdKey = 'popunderAdShown_session';
    if (!sessionStorage.getItem(popunderAdKey)) {
      sessionStorage.setItem(popunderAdKey, 'true');
      
      // This logic replicates the provided pop-under ad script dynamically and safely.
      const s = document.body.appendChild(document.createElement('script'));
      s.dataset.zone = '10186112';
      s.src = 'https://al5sm.com/tag.min.js';
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 text-base bg-white border-2 border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 shadow-sm hover:border-slate-300"
      />
    </div>
  );
};

export default SearchBar;
