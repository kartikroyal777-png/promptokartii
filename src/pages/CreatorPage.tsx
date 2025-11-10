import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import { Loader, User } from 'lucide-react';

const CreatorPage: React.FC = () => {
  const { creatorName } = useParams<{ creatorName: string }>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorPrompts = async () => {
      if (!creatorName) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('prompts')
        .select('*, categories(name)')
        .eq('creator_name', decodeURIComponent(creatorName))
        .order('created_at', { ascending: false });

      if (data) {
        setPrompts(data as any[]);
      }
      if (error) {
        console.error("Error fetching creator's prompts:", error);
      }
      setLoading(false);
    };

    fetchCreatorPrompts();
  }, [creatorName]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10"
      >
        <div className="text-center mb-12">
          <User className="w-16 h-16 mx-auto text-accent mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display mb-2">
            {decodeURIComponent(creatorName || 'Creator')}
          </h1>
          <p className="text-lg text-slate-600">Browse all prompts from this creator.</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader className="w-8 h-8 animate-spin text-accent mx-auto" />
          </div>
        ) : prompts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {prompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            <p>This creator hasn't uploaded any prompts yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreatorPage;
