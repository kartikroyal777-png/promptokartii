import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptCard from '../components/PromptCard';
import { supabase } from '../lib/supabase';
import { Prompt, Category } from '../types';
import { Loader } from 'lucide-react';

const PromptsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const [promptsRes, categoriesRes] = await Promise.all([
        supabase.from('prompts').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);

      if (promptsRes.error) {
        setError(promptsRes.error.message);
        console.error('Error fetching prompts:', promptsRes.error);
      } else {
        setPrompts(promptsRes.data as any[]);
      }

      if (categoriesRes.error) {
        // Not a fatal error for the page, but good to know
        console.error('Error fetching categories:', categoriesRes.error);
      } else {
        setCategories(categoriesRes.data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredPrompts = selectedCategory === 'All'
    ? prompts
    : prompts.filter(p => p.categories?.name === selectedCategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display text-center mb-4">Explore Prompts</h1>
        <p className="text-lg text-slate-600 text-center mb-12">Find inspiration for your next AI masterpiece.</p>
      </motion.div>

      <div className="flex justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
        <button
          key="All"
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ${
            selectedCategory === 'All'
              ? 'bg-accent text-white shadow-soft'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-300 ${
              selectedCategory === category.name
                ? 'bg-accent text-white shadow-soft'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {loading && <div className="text-center py-10"><Loader className="w-8 h-8 animate-spin text-accent mx-auto" /></div>}
      {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 lg:col-span-3 text-center py-10 text-slate-500"
              >
                No prompts found in this category.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default PromptsPage;
