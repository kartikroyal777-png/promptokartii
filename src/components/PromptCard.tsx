import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import { Prompt } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaHeart, FaInstagram } from "react-icons/fa";
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

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index = 0 }) => {
  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(prompt.like_count);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsLiked(getLikedPrompts().includes(prompt.id));
    setOptimisticLikeCount(prompt.like_count);
  }, [prompt.id, prompt.like_count]);

  const handleView = () => {
    // If a direct link exists, open it in a new tab first
    if (prompt.ad_direct_link_url) {
        window.open(prompt.ad_direct_link_url, '_blank');
    }
    // Then navigate to the prompt detail page in the current tab
    navigate(`/prompts/${prompt.prompt_id}`);
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
    
    toast.success('Liked!', { icon: '❤️' });

    const { error } = await supabase.rpc('increment_like_count', { p_prompt_id: prompt.id });
    
    if (error) {
      console.error("Error incrementing like count:", error.message);
    }
  };

  const creatorName = prompt.creator_name || 'Admin';
  const instagramUrl = prompt.instagram_handle ? `https://www.instagram.com/${prompt.instagram_handle.replace('@', '')}` : null;
  
  // Request a smaller image for the card (width 500px) to improve loading speed
  const transformedImageUrl = getTransformedImageUrl(prompt.image_url, 500, 80);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow duration-300 bg-white h-96"
    >
      <div onClick={handleView} className="cursor-pointer h-full w-full">
        <div className="w-full h-full bg-gray-200 relative">
            {/* Skeleton Placeholder behind image */}
            <div className={`absolute inset-0 bg-slate-200 ${!imageLoaded ? 'animate-pulse' : ''} z-0`} />
            
            <img 
                src={transformedImageUrl} 
                alt={prompt.title} 
                loading={index < 6 ? "eager" : "lazy"} // Eager load first 6 items
                decoding="async" // Async decoding to prevent main thread blocking
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
        
        {prompt.prompt_id && (
          <div className="absolute top-3 left-3 bg-black/40 text-white text-xs font-bold px-2.5 py-1.5 rounded-full backdrop-blur-sm z-30">
            ID: {prompt.prompt_id}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-30">
          {prompt.categories?.name && (
            <span className="inline-block bg-accent/90 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 backdrop-blur-sm">{prompt.categories.name}</span>
          )}
          <h3 className="text-lg font-bold font-display truncate drop-shadow-md">{prompt.title}</h3>
          <div className="text-sm text-slate-200 mt-1 flex items-center gap-2">
            <span>by 
              <Link 
                to={`/creator/${encodeURIComponent(creatorName)}`} 
                onClick={(e) => e.stopPropagation()}
                className="font-semibold hover:underline ml-1 text-white"
              >
                {creatorName}
              </Link>
            </span>
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-pink-400 transition-colors text-white">
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center z-40 backdrop-blur-[2px]">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div
                className="flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg hover:bg-sky-400 transition-colors"
            >
                <Eye className="w-5 h-5" />
                View Details
            </div>
            </div>
        </div>
      </div>
      
      <div className="absolute top-3 right-3 flex items-center gap-2 z-30">
        <button
          onClick={handleLikeClick}
          className={`p-2.5 rounded-full backdrop-blur-sm transition-colors duration-300 ${isLiked ? 'bg-red-500/90 text-white cursor-not-allowed' : 'bg-black/40 text-white hover:bg-black/60'}`}
          aria-label="Like prompt"
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
