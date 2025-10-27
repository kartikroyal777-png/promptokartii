import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeft, Copy, Check, Info, Loader, Heart } from 'lucide-react';
import StackedBannerAds from '../components/ads/StackedBannerAds';
import { FaHeart, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const getLikedPrompts = (): string[] => {
    const liked = localStorage.getItem('likedPrompts');
    return liked ? JSON.parse(liked) : [];
};

const addLikedPrompt = (promptId: string) => {
    const liked = getLikedPrompts();
    localStorage.setItem('likedPrompts', JSON.stringify([...liked, promptId]));
};

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [isLiked, setIsLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(0);

  useEffect(() => {
    if (id) {
        setIsLiked(getLikedPrompts().includes(id));
    }
  }, [id]);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      
      if (error) {
        setError(error.message);
      } else {
        setPrompt(data as any);
        setOptimisticLikeCount(data.like_count);
      }
      setLoading(false);
    };

    fetchPrompt();
  }, [id]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt_text);
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleLikeClick = async () => {
    if (!prompt) return;
    if (isLiked) {
        toast('You have already liked this prompt.', { icon: '😊' });
        return;
    }

    setIsLiked(true);
    setOptimisticLikeCount(prev => prev + 1);
    addLikedPrompt(prompt.id);

    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });

    const { error } = await supabase.rpc('increment_like_count', { p_prompt_id: prompt.id });
    if (error) {
      console.error("Error incrementing like:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-10 h-10 text-accent" /></div>;
  }
  
  if (error || !prompt) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 px-4 text-center">Error: {error || 'Prompt not found.'}</div>;
  }

  const creatorName = prompt.creator_name || 'Admin';
  const instagramUrl = prompt.instagram_handle ? `https://www.instagram.com/${prompt.instagram_handle.replace('@', '')}` : null;

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={() => navigate('/prompts')} variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prompts
          </Button>
          <StackedBannerAds />
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-soft">
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <motion.div 
                  className="lg:col-span-3 rounded-xl overflow-hidden shadow-soft-lg aspect-w-1 aspect-h-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
              >
                  <img src={prompt.image_url} alt={prompt.title} className="w-full h-full object-cover" />
              </motion.div>
              <div className="lg:col-span-2">
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  >
                  {prompt.categories?.name && <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-3">{prompt.categories.name}</span>}
                  <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-2">{prompt.title}</h1>
                  <div className="text-slate-500 mb-6 flex items-center gap-2">
                    <span>by {creatorName}</span>
                    {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                            <FaInstagram />
                        </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <Button onClick={handleLikeClick} variant={isLiked ? "primary" : "outline"} className={`transition-colors ${isLiked ? 'bg-red-500 hover:bg-red-600 border-red-500 cursor-not-allowed' : ''}`} disabled={isLiked}>
                        {isLiked ? <FaHeart className="w-4 h-4 mr-2"/> : <Heart className="w-4 h-4 mr-2"/>}
                        {optimisticLikeCount}
                    </Button>
                  </div>
                  
                  <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                  >
                      <div className="mb-8">
                      <h3 className="text-xl font-bold text-dark mb-3">Prompt Details</h3>
                      <div className="relative p-4 bg-slate-100 rounded-lg border border-slate-200">
                          <p className="text-slate-700 font-mono text-sm leading-relaxed break-words">{prompt.prompt_text}</p>
                          <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
                          <AnimatePresence mode="wait">
                              {isCopied ? 
                              <motion.div key="check" initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.5, opacity:0}}><Check className="w-4 h-4 text-green-600" /></motion.div> : 
                              <motion.div key="copy" initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.5, opacity:0}}><Copy className="w-4 h-4 text-slate-600" /></motion.div>
                              }
                          </AnimatePresence>
                          </button>
                      </div>
                      </div>
                      
                      {prompt.instructions && (
                        <div>
                        <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-accent"/> Instructions</h3>
                        <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg">
                            <p className="text-slate-700 leading-relaxed break-words whitespace-pre-wrap">{prompt.instructions}</p>
                        </div>
                        </div>
                      )}
                  </motion.div>
                  </motion.div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromptDetailPage;
