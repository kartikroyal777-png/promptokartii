import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import Button from '../components/ui/Button';
import { Plus, Loader, UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const UploadPromptPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [promptText, setPromptText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [adDirectLinkUrl, setAdDirectLinkUrl] = useState('');
  const navigate = useNavigate();

  const isFormValid = title && creatorName && imageFile && promptText && categoryId;

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      setLoadingCategories(true);
      setCategoryId('');
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories(data);
          setCategoryId(data[0].id.toString()); 
        } else {
          setCategories([]);
          toast.error("No categories found. Please add some in the admin panel first.");
        }
      } catch (error: any) {
        toast.error(error.message || "Could not fetch categories.");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchAndSetCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCreatorName('');
    setInstagramHandle('');
    setCategoryId(categories.length > 0 ? categories[0].id.toString() : '');
    setPromptText('');
    setInstructions('');
    setAdDirectLinkUrl('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill out all required fields and select a category.');
      return;
    }
    
    setFormLoading(true);
    const toastId = toast.loading('Uploading prompt...');

    const finalCategoryId = Number(categoryId);
    if (isNaN(finalCategoryId) || finalCategoryId <= 0) {
        toast.error('Invalid category selected. Please refresh and try again.', { id: toastId });
        setFormLoading(false);
        return;
    }
    
    // imageFile is checked by isFormValid, but TS doesn't know that, so we check again.
    if (!imageFile) {
        toast.error('An image is required.', { id: toastId });
        setFormLoading(false);
        return;
    }
    
    const fileName = `${uuidv4()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('prompt-images').upload(fileName, imageFile);
    
    if (uploadError) {
      toast.error(uploadError.message, { id: toastId });
      setFormLoading(false);
      return;
    }
    const imageUrl = supabase.storage.from('prompt-images').getPublicUrl(uploadData.path).data.publicUrl;
    
    const promptData = { 
      title, 
      category_id: finalCategoryId, 
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
              value={categoryId} 
              onChange={e => setCategoryId(e.target.value)}
              required 
              disabled={loadingCategories || categories.length === 0}
              className="w-full p-3 border border-light rounded-lg bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {loadingCategories ? 'Loading...' : (categories.length === 0 ? 'No categories available' : 'Select a category*')}
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Preview Image*</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400">
                    <ImageIcon className="mx-auto w-8 h-8" />
                    <span className="text-xs">Preview</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} required className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30 cursor-pointer"/>
            </div>
          </div>
          <textarea placeholder="Prompt Text*" value={promptText} onChange={e => setPromptText(e.target.value)} required rows={4} className="w-full p-3 border border-light rounded-lg"/>
          <textarea placeholder="Instructions for use (optional)" value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} className="w-full p-3 border border-light rounded-lg"/>
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={!isFormValid || formLoading || loadingCategories} icon={formLoading ? <Loader className="animate-spin"/> : <Plus />}>
              {formLoading ? 'Uploading...' : 'Upload Prompt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPromptPage;
