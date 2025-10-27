import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import { Prompt } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaHeart, FaInstagram } from "react-icons/fa";
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

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(prompt.like_count);

  useEffect(() => {
    setIsLiked(getLikedPrompts().includes(prompt.id));
  }, [prompt.id]);

  const handleView = () => {
    if (prompt.ad_direct_link_url) {
      window.open(prompt.ad_direct_link_url, '_blank', 'noopener,noreferrer');
    }
    navigate(`/prompt/${prompt.id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
        toast('You have already liked this prompt.', { icon: '😊' });
        return;
    }

    setIsLiked(true);
    setOptimisticLikeCount(prev => prev + 1);
    addLikedPrompt(prompt.id);
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const { error } = await supabase.rpc('increment_like_count', { p_prompt_id: prompt.id });
    if (error) {
      console.error("Error incrementing like:", error);
      // Note: No rollback on error to keep the UI simple for anonymous users
    }
  };

  const creatorName = prompt.creator_name || 'Admin';
  const instagramUrl = prompt.instagram_handle ? `https://www.instagram.com/${prompt.instagram_handle.replace('@', '')}` : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow duration-300 bg-white"
    >
      <div onClick={handleView} className="cursor-pointer">
        <img src={prompt.image_url} alt={prompt.title} className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          {prompt.categories?.name && (
            <span className="inline-block bg-accent/80 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">{prompt.categories.name}</span>
          )}
          <h3 className="text-lg font-bold font-display truncate">{prompt.title}</h3>
          <div className="text-sm text-slate-200 mt-1 flex items-center gap-2">
            <span>by {creatorName}</span>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-pink-400 transition-colors">
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 text-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div
                className="flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg"
            >
                <Eye className="w-5 h-5" />
                View Details
            </div>
            </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={handleLikeClick}
          className={`p-2.5 rounded-full backdrop-blur-sm transition-colors duration-300 ${isLiked ? 'bg-red-500/80 text-white cursor-not-allowed' : 'bg-black/40 text-white hover:bg-black/60'}`}
          aria-label="Like prompt"
          disabled={isLiked}
        >
          {isLiked ? <FaHeart size={16} /> : <Heart size={16} />}
        </button>
        <span className="bg-black/40 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full backdrop-blur-sm">
          {optimisticLikeCount}
        </span>
      </div>
    </motion.div>
  );
};

export default PromptCard;
