import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import Button from '../components/ui/Button';
import { Plus, Loader, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const UploadPromptPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [promptText, setPromptText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [adDirectLinkUrl, setAdDirectLinkUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) toast.error("Could not fetch categories");
      else setCategories(data);
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCreatorName('');
    setInstagramHandle('');
    setCategoryId(categories.length > 0 ? categories[0].id : undefined);
    setPromptText('');
    setInstructions('');
    setAdDirectLinkUrl('');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image file.');
      return;
    }
    if (categoryId === undefined) {
      toast.error('Please select a category.');
      return;
    }

    setFormLoading(true);
    const toastId = toast.loading('Uploading prompt...');
    
    let imageUrl = '';

    const fileName = `${uuidv4()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('prompt-images').upload(fileName, imageFile);
    
    if (uploadError) {
      toast.error(uploadError.message, { id: toastId });
      setFormLoading(false);
      return;
    }
    imageUrl = supabase.storage.from('prompt-images').getPublicUrl(uploadData.path).data.publicUrl;
    
    const promptData = { 
      title, 
      category_id: categoryId, 
      image_url: imageUrl, 
      prompt_text: promptText, 
      instructions, 
      creator_name: creatorName || 'Anonymous',
      instagram_handle: instagramHandle || null,
      ad_direct_link_url: adDirectLinkUrl || null
    };

    const { error } = await supabase.from('prompts').insert([promptData]);
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Prompt uploaded successfully!', { id: toastId });
      resetForm();
      navigate('/prompts');
    }
    setFormLoading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-soft max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <UploadCloud className="w-16 h-16 mx-auto text-accent mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-dark font-display">Upload Your Prompt</h1>
            <p className="text-md md:text-lg text-slate-600 mt-2">Share your creation with the world and monetize it.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Prompt Title*" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
            <select 
              value={categoryId === undefined ? '' : categoryId} 
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              required 
              disabled={categories.length === 0}
              className="w-full p-3 border border-light rounded-lg bg-white disabled:bg-slate-100"
            >
              <option value="" disabled>
                {categories.length === 0 ? 'Loading categories...' : 'Select a category*'}
              </option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Your Name (for credit)*" value={creatorName} onChange={e => setCreatorName(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
            <input type="text" placeholder="Instagram Handle (e.g., @username)" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} className="w-full p-3 border border-light rounded-lg"/>
          </div>
          <input type="url" placeholder="Your Ad/Monetization Direct Link (optional)" value={adDirectLinkUrl} onChange={e => setAdDirectLinkUrl(e.target.value)} className="w-full p-3 border border-light rounded-lg"/>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preview Image*</label>
            <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} required className="w-full p-3 border border-light rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"/>
          </div>
          <textarea placeholder="Prompt Text*" value={promptText} onChange={e => setPromptText(e.target.value)} required rows={4} className="w-full p-3 border border-light rounded-lg"/>
          <textarea placeholder="Instructions for use (optional)" value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} className="w-full p-3 border border-light rounded-lg"/>
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={formLoading} icon={formLoading ? <Loader className="animate-spin"/> : <Plus />}>
              {formLoading ? 'Uploading...' : 'Upload Prompt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPromptPage;
