import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-7 h-7 text-accent" />
              <span className="text-2xl font-bold text-dark font-display">
                OG<span className="text-accent">Prompts</span>
              </span>
            </Link>
            <p className="text-slate-600 max-w-xs">
              The #1 free platform to discover, share, and monetize AI art prompts.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/kartikkumawat.ai/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-500 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://t.me/+2kmMIBggTIsxNzc1" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-500 transition-colors">
                <FaTelegram size={24} />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg text-dark mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link to="/prompts" className="text-slate-500 hover:text-accent transition-colors">Explore</Link></li>
                <li><Link to="/upload" className="text-slate-500 hover:text-accent transition-colors">Upload</Link></li>
                <li><Link to="/instructions" className="text-slate-500 hover:text-accent transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-500 hover:text-accent transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-dark mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-slate-500 hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-500 hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-light text-center text-slate-500 text-sm">
          &copy; {year} OG Prompts. A project by Kartik Kumawat & Akshita.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
