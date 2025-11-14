import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowRight, Loader, Upload, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import SearchBar from '../components/ui/SearchBar';
import { FaInstagram, FaTelegram } from 'react-icons/fa';
import Orb from '../components/Orb';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('prompts')
        .select('*, categories(name)')
        .order('like_count', { ascending: false })
        .limit(6);
      if (data) setPrompts(data as any[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/prompts?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-grid py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Orb hoverIntensity={0.5} rotateOnHover={true} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark font-display leading-tight mb-4" style={{ fontWeight: 800 }}>
                Free, Open-Source AI Prompts
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                The #1 free platform to discover and share high-quality AI art prompts.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-xl flex flex-col items-center gap-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                <Button onClick={() => navigate('/prompts')} variant="primary" icon={<Zap size={18}/>} className="w-full sm:w-auto">
                  Explore Prompts
                </Button>
                 <Button onClick={() => navigate('/instructions')} variant="outline" icon={<Upload size={18}/>} className="w-full sm:w-auto">
                  How to Use
                </Button>
              </div>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                placeholder="Search for prompts..."
                className="w-full"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trending Prompts Section */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark font-display">Trending Prompts</h2>
            <p className="text-lg text-slate-600 mt-2">Get a glimpse of our most popular creations.</p>
          </motion.div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {prompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button onClick={() => navigate('/prompts')} variant="outline" icon={<ArrowRight />}>View All Prompts</Button>
          </div>
        </div>
      </div>

      {/* Join Community Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-dark font-display mb-4">Join the Community</h2>
            <p className="text-lg text-slate-600 mb-8">Connect with fellow creators, share your art, and stay updated on the latest prompts.</p>
            <div className="flex justify-center gap-4">
              <a href="https://www.instagram.com/kartikkumawat.ai/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-0">
                  <FaInstagram className="mr-2" /> Instagram
                </Button>
              </a>
              <a href="https://t.me/+2kmMIBggTIsxNzc1" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="bg-sky-500 text-white border-0 hover:bg-sky-600">
                  <FaTelegram className="mr-2" /> Telegram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
