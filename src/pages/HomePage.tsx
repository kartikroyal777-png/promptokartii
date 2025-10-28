import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowRight, Loader, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import SearchBar from '../components/ui/SearchBar';
import Orb from '../components/Orb';
import MobileAdBanners from '../components/ads/MobileAdBanners';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
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
    if (query.trim()) {
      navigate(`/prompts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <div className="w-full relative flex items-center justify-center pt-16 pb-12 md:pt-20">
        <div className="absolute inset-0 z-[-1] pointer-events-none">
            <Orb hue={200} hoverIntensity={0.5} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="w-full flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark font-display leading-tight mb-2 break-words" style={{ fontWeight: 800 }}>
                Dollar<span className="text-accent">Prompt</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-8 max-w-lg mx-auto">
                Monetize your prompts with <strong className="text-accent bg-accent/10 px-2 py-1 rounded-md">0% commission</strong>.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-md"
            >
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                className="w-full mb-8"
              />
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button onClick={() => navigate('/upload')} variant="primary" icon={<Upload size={16}/>}>
                  Upload Your Prompt
                </Button>
                 <Button onClick={() => navigate('/prompts')} variant="outline" icon={<ArrowRight />}>
                  Explore Prompts
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MobileAdBanners />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <Button onClick={() => navigate('/prompts')} variant="outline">View All Prompts</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
