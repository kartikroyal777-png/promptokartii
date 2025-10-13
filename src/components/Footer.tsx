import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="text-lg font-bold text-dark font-display">SeedreamPrompts</span>
        </div>
        <p>&copy; {new Date().getFullYear()} SeedreamPrompts. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
