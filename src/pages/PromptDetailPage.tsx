import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import Button from '../components/ui/Button';
import { PromptDetailSkeleton } from '../components/ui/Skeleton';
import { ArrowLeft, Copy, Check, Info, Heart } from 'lucide-react';
import { FaHeart, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getTransformedImageUrl } from '../lib/utils';

const getLikedPrompts = (): string[] => {
    const liked = localStorage.getItem('likedPrompts');
    return liked ? JSON.parse(liked) : [];
};

const setLikedPrompts = (liked: string[]) => {
    localStorage.setItem('likedPrompts', JSON.stringify(liked));
};

const addLikedPrompt = (promptId: string) => {
    const liked = getLikedPrompts();
    if (!liked.includes(promptId)) {
        setLikedPrompts([...liked, promptId]);
    }
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
    const fetchPrompt = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*, categories(name)')
        .eq('prompt_id', id)
        .single();
      
      if (error) {
        setError(error.message);
      } else {
        setPrompt(data as any);
        setOptimisticLikeCount(data.like_count);
        if (data) {
          setIsLiked(getLikedPrompts().includes(data.id));
        }
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
      toast.success('Prompt copied to clipboard!');
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
    
    toast.success('Liked!', { icon: '❤️' });

    const { error } = await supabase.rpc('increment_like_count', { p_prompt_id: prompt.id });
    if (error) {
      console.error("Error incrementing like:", error);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Button onClick={() => navigate('/prompts')} variant="outline" className="mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Prompts
                </Button>
                <PromptDetailSkeleton />
            </div>
        </div>
    );
  }
  
  if (error || !prompt) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 px-4 text-center">Error: {error || 'Prompt not found.'}</div>;
  }

  const creatorName = prompt.creator_name || 'Admin';
  const instagramUrl = prompt.instagram_handle ? `https://www.instagram.com/${prompt.instagram_handle.replace('@', '')}` : null;
  
  // Request a high quality but optimized image for detail view (width 1200px)
  const transformedImageUrl = getTransformedImageUrl(prompt.image_url, 1200, 90);

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button onClick={() => navigate('/prompts')} variant="outline" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prompts
          </Button>
          
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-soft">
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <motion.div 
                  className="lg:col-span-3 rounded-xl overflow-hidden shadow-soft-lg bg-slate-100"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
              >
                  <img src={transformedImageUrl} alt={prompt.title} className="w-full h-auto object-cover" />
              </motion.div>
              <div className="lg:col-span-2">
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  >
                  <div className="flex justify-between items-start">
                    {prompt.categories?.name && <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-3">{prompt.categories.name}</span>}
                    {prompt.prompt_id && <span className="text-sm font-bold text-slate-400">ID: {prompt.prompt_id}</span>}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-2">{prompt.title}</h1>
                  <div className="text-slate-500 mb-6 flex items-center gap-2">
                    <span>by 
                      <Link 
                        to={`/creator/${encodeURIComponent(creatorName)}`} 
                        className="font-semibold hover:underline ml-1 text-slate-600"
                      >
                        {creatorName}
                      </Link>
                    </span>
                    {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                            <FaInstagram />
                        </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-8 flex-wrap">
                    <Button onClick={handleLikeClick} variant={isLiked ? "primary" : "outline"} className={`transition-colors ${isLiked ? 'bg-red-500 hover:bg-red-600 border-red-500 cursor-not-allowed' : ''}`} disabled={isLiked}>
                        {isLiked ? <FaHeart className="w-4 h-4 mr-2"/> : <Heart className="w-4 h-4 mr-2"/>}
                        {optimisticLikeCount}
                    </Button>
                    
                    {/* Direct Link Button Removed as per request */}
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
