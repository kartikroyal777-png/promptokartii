import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
    >
      <img src={prompt.image_url} alt={prompt.title} className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <span className="inline-block bg-accent/80 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">{prompt.categories?.name}</span>
        <h3 className="text-xl font-bold font-display">{prompt.title}</h3>
      </div>
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Link to={`/prompt/${prompt.id}`} className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg hover:bg-sky-500 transition-colors">
            <Sparkles className="w-5 h-5" />
            Unlock Free
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default PromptCard;
