import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Orb from '../components/Orb';
import { ArrowRight, ShieldCheck, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HeroImage as HeroImageType, Prompt } from '../types';
import PromptCard from '../components/PromptCard';

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
  const [heroImages, setHeroImages] = useState<HeroImageType[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [heroImagesRes, promptsRes] = await Promise.all([
        supabase.from('hero_images').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('prompts').select('*').order('created_at', { ascending: false }).limit(6)
      ]);

      if (heroImagesRes.data) setHeroImages(heroImagesRes.data);
      if (promptsRes.data) setPrompts(promptsRes.data);
      
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const imagePositions = [
    { className: "w-48 h-72 top-1/2 -translate-y-[70%] left-0 rotate-[-15deg]", delay: 0 },
    { className: "w-64 h-48 top-1/2 -translate-y-[30%] left-1/2 -translate-x-1/2 z-10", delay: 0.5 },
    { className: "w-48 h-72 top-1/2 -translate-y-[40%] right-0 rotate-[15deg]", delay: 1 },
  ];

  return (
    <>
      <div className="w-full min-h-screen overflow-hidden relative flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-50">
          <Orb />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-dark font-display leading-tight mb-4">
                Seedream<span className="text-accent">Prompts</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8">
                Unlock creative AI prompts, one ad at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={() => navigate('/prompts')} variant="primary" className="w-full sm:w-auto" icon={<ArrowRight />}>
                  Explore Prompts
                </Button>
                <Button onClick={() => navigate('/login')} variant="secondary" className="w-full sm:w-auto" icon={<ShieldCheck />}>
                  Login as Admin
                </Button>
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

      <div className="py-20 bg-slate-50">
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
