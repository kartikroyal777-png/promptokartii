import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTelegram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="bg-white border-t border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold text-lg text-dark mb-4">DollarPrompt</h3>
            <p className="text-slate-500 max-w-xs">
              A free, open-source platform to share and monetize your AI art prompts. We take 0% commission.
            </p>
            <p className="text-sm text-slate-400 mt-4">&copy; {year} DollarPrompt. Built by Kartik Kumawat.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-dark mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-500 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-500 hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-dark mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start items-center gap-4">
              <a href="https://www.instagram.com/kartikkumawat.ai/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-pink-500 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://t.me/+2kmMIBggTIsxNzc1" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-500 transition-colors">
                <FaTelegram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
