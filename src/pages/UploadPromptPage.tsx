import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import Button from '../components/ui/Button';
import { Loader, UploadCloud, Image as ImageIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const UploadPromptPage: React.FC = () => {
  const navigate = useNavigate();

  // Form fields state
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [adDirectLinkUrl, setAdDirectLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category state - Re-engineered for reliability
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // Use number type
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Submission state
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories(data);
          // **DEFINITIVE FIX**: Automatically select the first category's numeric ID.
          setSelectedCategoryId(data[0].id);
        } else {
          setCategories([]);
          toast.error("No categories found. Please add categories in your database first.");
        }
      } catch (error: any) {
        toast.error(error.message || "Could not fetch categories.");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    // --- RE-ENGINEERED VALIDATION ---
    if (!selectedCategoryId || selectedCategoryId <= 0) {
        toast.error("A category must be selected. Please wait for categories to load or refresh the page.");
        setFormLoading(false);
        return;
    }

    if (!imageFile) {
      toast.error("A preview image is required.");
      setFormLoading(false);
      return;
    }
    if (!title.trim() || !creatorName.trim() || !promptText.trim()) {
      toast.error("Please fill in all required fields: Title, Your Name, and Prompt Text.");
      setFormLoading(false);
      return;
    }

    const toastId = toast.loading('Uploading prompt...');

    try {
      const fileName = `${uuidv4()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(fileName, imageFile);
      
      if (uploadError) throw new Error(uploadError.message);

      const imageUrl = supabase.storage.from('prompt-images').getPublicUrl(uploadData.path).data.publicUrl;
      
      const promptData = { 
        title: title.trim(), 
        category_id: selectedCategoryId, // Already a number
        image_url: imageUrl, 
        prompt_text: promptText.trim(), 
        instructions: instructions.trim() || null,
        creator_name: creatorName.trim(),
        instagram_handle: instagramHandle.trim() || null,
        ad_direct_link_url: adDirectLinkUrl.trim() || null
      };

      const { error: insertError } = await supabase.from('prompts').insert([promptData]);
      if (insertError) {
        await supabase.storage.from('prompt-images').remove([fileName]);
        throw new Error(`Upload failed: ${insertError.message}`);
      }
      
      toast.success('Prompt uploaded successfully!', { id: toastId });
      navigate('/prompts');

    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setFormLoading(false);
    }
  };

  const isSubmitDisabled = formLoading || loadingCategories || categories.length === 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-soft max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <UploadCloud className="w-16 h-16 mx-auto text-accent mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-dark font-display">Upload Your Prompt</h1>
            <p className="text-md md:text-lg text-slate-600 mt-2">Share your creation with the world and monetize it.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Prompt Title*" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
            <input type="text" placeholder="Your Name (for credit)*" value={creatorName} onChange={e => setCreatorName(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Instagram Handle (e.g., @username)" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} className="w-full p-3 border border-light rounded-lg"/>
            <input type="url" placeholder="Your Ad/Monetization Direct Link (optional)" value={adDirectLinkUrl} onChange={e => setAdDirectLinkUrl(e.target.value)} className="w-full p-3 border border-light rounded-lg"/>
          </div>

          {/* --- RE-ENGINEERED CATEGORY SELECTION --- */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category*</label>
            <div className="p-3 border border-light rounded-lg bg-slate-50">
              {loadingCategories ? (
                <div className="text-slate-500">Loading categories...</div>
              ) : categories.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)} // Set number directly
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border-2 flex items-center gap-2 ${
                        selectedCategoryId === cat.id // Compare numbers
                          ? 'bg-accent text-white border-accent shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-accent/50'
                      }`}
                    >
                      {selectedCategoryId === cat.id && <motion.div initial={{scale:0}} animate={{scale:1}}><Check className="w-4 h-4" /></motion.div>}
                      {cat.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-red-500">No categories available to select.</div>
              )}
            </div>
          </div>

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
            <Button type="submit" disabled={isSubmitDisabled}>
              {formLoading ? <Loader className="animate-spin"/> : 'Upload Prompt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPromptPage;
