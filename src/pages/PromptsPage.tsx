import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PromptCard from '../components/PromptCard';
import { supabase } from '../lib/supabase';
import { Prompt, Category } from '../types';
import { Loader, AlertTriangle } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import MobileAdBanners from '../components/ads/MobileAdBanners';
import AdComponent from '../components/ads/AdComponent';

const PromptsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [promptsRes, categoriesRes] = await Promise.all([
          supabase.from('prompts').select('*, categories(name)').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name', { ascending: true }),
        ]);

        if (promptsRes.error) throw promptsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        setPrompts(promptsRes.data as any[]);
        setCategories(categoriesRes.data);

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError("Could not load data. This might be due to a network issue or a browser extension (like an ad blocker) interfering with the connection. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.trim()) {
      navigate(`/prompts?search=${encodeURIComponent(newSearchTerm.trim())}`, { replace: true });
    } else {
      navigate('/prompts', { replace: true });
    }
  };

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter(p => selectedCategory === 'All' || p.categories?.name === selectedCategory)
      .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [prompts, selectedCategory, searchTerm]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10"
      >
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display mb-4">Explore Prompts</h1>
            <p className="text-lg text-slate-600">Find inspiration for your next AI masterpiece.</p>
        </div>
        
        <div className="hidden md:flex justify-center my-8">
             <AdComponent 
                type="options" 
                scriptSrc="//www.highperformanceformat.com/336a43554e25b2330d93dfe8a5251632/invoke.js" 
                options={{ key: '336a43554e25b2330d93dfe8a5251632', format: 'iframe', height: 90, width: 728, params: {} }} 
            />
        </div>
        <MobileAdBanners />

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
            onSearch={() => {}} // Search is real-time
          />
        </div>

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
        
        {error && (
            <div className="text-center py-10 text-red-500 bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Connection Error</h3>
            <p>{error}</p>
            </div>
        )}

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
                    No prompts found matching your criteria.
                </motion.div>
                )}
            </AnimatePresence>
            </motion.div>
        )}

        <div className="hidden md:flex justify-center my-8">
             <AdComponent 
                type="options" 
                scriptSrc="//www.highperformanceformat.com/bfd6ce59842e7a37b3d4212cfb7774d5/invoke.js" 
                options={{ key: 'bfd6ce59842e7a37b3d4212cfb7774d5', format: 'iframe', height: 60, width: 468, params: {} }} 
            />
        </div>
        <MobileAdBanners />

      </motion.div>
    </div>
  );
};

export default PromptsPage;
