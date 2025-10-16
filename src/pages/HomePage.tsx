import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Orb from '../components/Orb';
import { ArrowRight, ShieldCheck, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HeroImage as HeroImageType, Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import SearchBar from '../components/ui/SearchBar';
import { useAuth } from '../contexts/AuthContext';

const FloatingImage = ({ src, alt, className, delay = 0 }: { src: string, alt: string, className: string, delay?: number }) => (
  <motion.div
    className={`absolute rounded-xl shadow-soft-lg overflow-hidden border-2 border-white/50 ${className}`}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: [20, -20, 20], opacity: 1 }}
    transition={{
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: delay
    }}
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </motion.div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [heroImages, setHeroImages] = useState<HeroImageType[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [heroImagesRes, promptsRes] = await Promise.all([
        supabase.from('hero_images').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('prompts').select('*, categories(name)').order('created_at', { ascending: false }).limit(6)
      ]);

      if (heroImagesRes.data && heroImagesRes.data.length > 0) {
        setHeroImages(heroImagesRes.data);
      } else {
        setHeroImages([
          { id: 1, image_url: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/400x600/38bdf8/ffffff?text=Style', alt_text: 'Placeholder hero image 1', created_at: new Date().toISOString() },
          { id: 2, image_url: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/0f172a/ffffff?text=Art', alt_text: 'Placeholder hero image 2', created_at: new Date().toISOString() },
          { id: 3, image_url: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/400x600/e2e8f0/0f172a?text=Creative', alt_text: 'Placeholder hero image 3', created_at: new Date().toISOString() },
        ]);
      }

      if (promptsRes.data) setPrompts(promptsRes.data as any[]);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/prompts?search=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const imagePositions = [
    { className: "w-48 h-72 top-1/2 -translate-y-[70%] left-0 rotate-[-15deg]", delay: 0 },
    { className: "w-64 h-48 top-1/2 -translate-y-[30%] left-1/2 -translate-x-1/2 z-10", delay: 0.5 },
    { className: "w-48 h-72 top-1/2 -translate-y-[40%] right-0 rotate-[15deg]", delay: 1 },
  ];

  return (
    <>
      <div className="w-full min-h-screen overflow-hidden relative flex items-center justify-center pt-28 pb-16 md:pt-20">
        <div className="absolute inset-0 z-0 opacity-50">
          <Orb />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark font-display leading-tight mb-4">
                Seedream<span className="text-accent">Prompts</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg">
                Earn credits, unlock creative AI prompts.
              </p>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                className="w-full max-w-md mb-8"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate('/prompts')} variant="primary" icon={<ArrowRight />}>
                  Explore Prompts
                </Button>
                {isAdmin && (
                  <Button onClick={() => navigate('/admin')} variant="secondary" icon={<ShieldCheck />}>
                    Admin Panel
                  </Button>
                )}
              </div>
            </motion.div>
            <div className="relative h-96 lg:h-[500px] hidden lg:block">
              {heroImages.map((img, index) => (
                <FloatingImage 
                  key={img.id}
                  src={img.image_url} 
                  alt={img.alt_text}
                  className={imagePositions[index % imagePositions.length].className}
                  delay={imagePositions[index % imagePositions.length].delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark font-display">Latest Prompts</h2>
            <p className="text-lg text-slate-600 mt-2">Get a glimpse of our growing collection.</p>
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
