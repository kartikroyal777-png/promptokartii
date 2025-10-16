import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeft, Copy, Check, Info, Loader, Lock, Coins } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import toast from 'react-hot-toast';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unlockedPrompts, profile, loadingProfile, unlockPrompt, promptCost } = useProfile();

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const copyTimeoutRef = useRef<number>();

  const isUnlocked = unlockedPrompts.includes(id!);

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
    if (prompt && isUnlocked) {
      navigator.clipboard.writeText(prompt.prompt_text);
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUnlock = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (profile && profile.credits < promptCost) {
      toast.error("You don't have enough credits.", { icon: '😟' });
      navigate('/earn');
      return;
    }
    setUnlocking(true);
    await unlockPrompt(id!);
    setUnlocking(false);
  };

  if (loading || loadingProfile) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-10 h-10 text-accent" /></div>;
  }
  
  if (error || !prompt) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 px-4 text-center">Error: {error || 'Prompt not found.'}</div>;
  }

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
                  <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-3">{prompt.categories?.name}</span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-dark font-display mb-8">{prompt.title}</h1>
                  
                  <AnimatePresence mode="wait">
                    {isUnlocked ? (
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
                          
                          <div>
                          <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-accent"/> Instructions</h3>
                          <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg">
                              <p className="text-slate-700 leading-relaxed break-words whitespace-pre-wrap">{prompt.instructions}</p>
                          </div>
                          </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="locked"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-center flex flex-col items-center justify-center h-full"
                      >
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10"></div>
                        <div className="relative z-20">
                          <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4"/>
                          <h3 className="text-xl font-bold text-dark mb-2">Unlock this Prompt</h3>
                          <p className="text-slate-600 mb-6">Unlock this prompt to view the details and copy the text.</p>
                          <Button onClick={handleUnlock} disabled={unlocking} className="w-full">
                            {unlocking ? <Loader className="animate-spin" /> : (
                              <>
                                <Coins className="w-5 h-5" />
                                {`Unlock for ${promptCost} Credit`}
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
