import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PromptCard from '../components/PromptCard';
import { supabase } from '../lib/supabase';
import { Prompt, Category } from '../types';
import { Loader, AlertTriangle } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import Ad728x90 from '../components/ads/Ad728x90';
import Ad468x60 from '../components/ads/Ad468x60';
import Ad300x250 from '../components/ads/Ad300x250';
import Ad320x50 from '../components/ads/Ad320x50';
import Button from '../components/ui/Button';

const PAGE_SIZE = 12;

const PromptsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCategoriesData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
      if (error) throw error;
      setCategories(data);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError("Could not load categories. Please try again.");
    }
  }, []);

  const fetchPromptsData = useCallback(async (isInitialLoad: boolean) => {
    if (isInitialLoad) {
      setLoading(true);
      setPrompts([]);
      setPage(0);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const from = isInitialLoad ? 0 : (page + 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase.from('prompts').select('*, categories(name)', { count: 'exact' });

      if (searchTerm) {
        const isNumericId = /^\d{5}$/.test(searchTerm);
        if (isNumericId) {
          query = query.eq('prompt_id', parseInt(searchTerm, 10));
        } else {
          query = query.ilike('title', `%${searchTerm}%`);
        }
      }
      
      if (selectedCategory !== 'All') {
        const category = categories.find(c => c.name === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      query = query.order('created_at', { ascending: false }).range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      
      const newPrompts = data as any[];
      setPrompts(prev => isInitialLoad ? newPrompts : [...prev, ...newPrompts]);
      setHasMore(newPrompts.length === PAGE_SIZE && (count ? (from + newPrompts.length) < count : true));
      if (!isInitialLoad) setPage(prev => prev + 1);

    } catch (err: any) {
      console.error('Error fetching prompts:', err);
      setError("Could not load prompts. This might be due to a network issue or a browser extension (like an ad blocker) interfering. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, searchTerm, selectedCategory, categories]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  useEffect(() => {
    // Fetch prompts only when categories are loaded, or if a search term exists
    if (categories.length > 0 || searchTerm) {
      fetchPromptsData(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = () => {
    const newSearchTerm = searchTerm;
    if (newSearchTerm.trim()) {
      navigate(`/prompts?search=${encodeURIComponent(newSearchTerm.trim())}`, { replace: true });
    } else {
      navigate('/prompts', { replace: true });
    }
    // The useEffect will trigger the fetch
  };

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
        
        <div className="flex flex-col items-center gap-4 my-8">
            <div className="hidden md:block"><Ad728x90 /></div>
            <div className="md:hidden"><Ad320x50 /></div>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
            onSearch={handleSearchSubmit}
            placeholder="Search by title or 5-digit ID..."
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
        
        {loading && prompts.length === 0 && <div className="text-center py-10"><Loader className="w-8 h-8 animate-spin text-accent mx-auto" /></div>}
        
        {error && (
            <div className="text-center py-10 text-red-500 bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Connection Error</h3>
            <p>{error}</p>
            </div>
        )}

        {!loading && !error && prompts.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No prompts found matching your criteria.
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {prompts.map(prompt => (
                <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12">
          {loadingMore ? (
            <Loader className="w-8 h-8 animate-spin text-accent mx-auto" />
          ) : hasMore && prompts.length > 0 ? (
            <Button onClick={() => fetchPromptsData(false)} variant="outline">
              Load More
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-4 my-8 pt-8 border-t border-light">
            <div className="hidden md:block"><Ad468x60 /></div>
            <div className="md:hidden"><Ad300x250 /></div>
        </div>

      </motion.div>
    </div>
  );
};

export default PromptsPage;
