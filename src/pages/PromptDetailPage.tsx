import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeft, Gift, Copy, Check, Info, Loader } from 'lucide-react';

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        setError(error.message);
        console.error('Error fetching prompt:', error);
      } else {
        setPrompt(data as Prompt);
      }
      setLoading(false);
    };

    fetchPrompt();
  }, [id]);

  const handleUnlock = () => {
    // In a real app, this would trigger AdGem.showOfferWall()
    console.log("Simulating ad watch...");
    setTimeout(() => {
      setIsUnlocked(true);
      if (canvasRef.current) {
        const myConfetti = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true
        });
        myConfetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.6 }
        });
      }
    }, 1500);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt_text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;
  }
  
  if (error || !prompt) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error || 'Prompt not found.'}</div>;
  }

  return (
    <div className="min-h-screen py-28">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate('/prompts')} variant="outline" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Prompts
        </Button>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div 
            className="lg:col-span-3 rounded-xl overflow-hidden shadow-soft-lg"
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
              <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-3 py-1 rounded-full mb-3">{prompt.category}</span>
              <h1 className="text-4xl font-extrabold text-dark font-display mb-8">{prompt.title}</h1>
              
              {!isUnlocked ? (
                <div className="p-6 bg-slate-50 rounded-lg text-center">
                  <h2 className="text-xl font-bold text-dark mb-4">Unlock this Prompt</h2>
                  <p className="text-slate-600 mb-6">Watch a short ad to reveal the full prompt and instructions for free.</p>
                  <Button onClick={handleUnlock} variant="primary" className="w-full" icon={<Gift />}>
                    Watch Ad to Unlock Prompt
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-dark mb-3">Prompt Unlocked 🎉</h3>
                    <div className="relative p-4 bg-slate-100 rounded-lg">
                      <p className="text-slate-700 font-mono text-sm leading-relaxed">{prompt.prompt_text}</p>
                      <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
                        {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-accent"/> Instructions</h3>
                    <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg">
                      <p className="text-slate-700 leading-relaxed">{prompt.instructions}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailPage;
