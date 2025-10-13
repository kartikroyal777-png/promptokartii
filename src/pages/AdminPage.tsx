import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Prompt, HeroImage, PromptCategory } from '../types';
import Button from '../components/ui/Button';
import { Plus, Loader, Trash2, X, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

const promptCategories: PromptCategory[] = ['Men', 'Women', 'Abstract', 'Kids', 'Other'];

type AdminTab = 'prompts' | 'hero';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('prompts');
  
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loadingHeroImages, setLoadingHeroImages] = useState(true);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingHeroImage, setEditingHeroImage] = useState<HeroImage | null>(null);

  const [formLoading, setFormLoading] = useState(false);

  const fetchPrompts = useCallback(async () => {
    setLoadingPrompts(true);
    const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
    if (error) toast.error(error.message); else setPrompts(data as Prompt[]);
    setLoadingPrompts(false);
  }, []);

  const fetchHeroImages = useCallback(async () => {
    setLoadingHeroImages(true);
    const { data, error } = await supabase.from('hero_images').select('*').order('created_at', { ascending: false });
    if (error) toast.error(error.message); else setHeroImages(data);
    setLoadingHeroImages(false);
  }, []);

  useEffect(() => {
    fetchPrompts();
    fetchHeroImages();
  }, [fetchPrompts, fetchHeroImages]);
  
  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowPromptForm(true);
  };
  
  const handleEditHeroImage = (image: HeroImage) => {
    setEditingHeroImage(image);
    setShowHeroForm(true);
  };

  const handleDeletePrompt = async (promptId: number, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;
    const toastId = toast.loading('Deleting prompt...');
    
    const { error: dbError } = await supabase.from('prompts').delete().eq('id', promptId);
    if (dbError) {
      toast.error(dbError.message, { id: toastId });
      return;
    }
    
    const filePath = imageUrl.split('/prompt-images/')[1];
    if (filePath) {
      const { error: storageError } = await supabase.storage.from('prompt-images').remove([filePath]);
      if (storageError) {
        toast.error(`Prompt deleted, but failed to remove image: ${storageError.message}`, { id: toastId });
      }
    }

    toast.success('Prompt deleted successfully!', { id: toastId });
    fetchPrompts();
  };

  const handleDeleteHeroImage = async (imageId: number, imageUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) return;
    const toastId = toast.loading('Deleting image...');

    const { error: dbError } = await supabase.from('hero_images').delete().eq('id', imageId);
    if (dbError) {
      toast.error(dbError.message, { id: toastId });
      return;
    }
    
    const filePath = imageUrl.split('/prompt-images/')[1];
    if (filePath) {
      const { error: storageError } = await supabase.storage.from('prompt-images').remove([filePath]);
      if (storageError) {
        toast.error(`Image deleted, but failed to remove from storage: ${storageError.message}`, { id: toastId });
      }
    }

    toast.success('Hero image deleted!', { id: toastId });
    fetchHeroImages();
  };

  const handleTogglePromptForm = () => {
    setShowPromptForm(!showPromptForm);
    setEditingPrompt(null); // Reset editing state when toggling
  };

  const handleToggleHeroForm = () => {
    setShowHeroForm(!showHeroForm);
    setEditingHeroImage(null); // Reset editing state when toggling
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-dark font-display">Admin Dashboard</h1>
        <p className="text-md md:text-lg text-slate-600">Manage your prompts and site content.</p>
      </motion.div>

      <div className="flex border-b border-light mb-8 flex-wrap">
        <TabButton name="Manage Prompts" tab="prompts" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton name="Manage Hero Images" tab="hero" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {activeTab === 'prompts' && (
        <AdminSection
          title="Prompts"
          loading={loadingPrompts}
          showForm={showPromptForm}
          onToggleForm={handleTogglePromptForm}
          isEditing={!!editingPrompt}
          renderForm={() => <PromptForm setFormLoading={setFormLoading} formLoading={formLoading} promptToEdit={editingPrompt} onComplete={() => { fetchPrompts(); setShowPromptForm(false); setEditingPrompt(null); }} />}
          renderTable={() => (
            <PromptsTable prompts={prompts} onEdit={handleEditPrompt} onDelete={handleDeletePrompt} />
          )}
        />
      )}

      {activeTab === 'hero' && (
        <AdminSection
          title="Hero Images"
          loading={loadingHeroImages}
          showForm={showHeroForm}
          onToggleForm={handleToggleHeroForm}
          isEditing={!!editingHeroImage}
          renderForm={() => <HeroImageForm setFormLoading={setFormLoading} formLoading={formLoading} heroImageToEdit={editingHeroImage} onComplete={() => { fetchHeroImages(); setShowHeroForm(false); setEditingHeroImage(null); }} />}
          renderTable={() => (
            <HeroImagesTable heroImages={heroImages} onEdit={handleEditHeroImage} onDelete={handleDeleteHeroImage} />
          )}
        />
      )}
    </div>
  );
};

const TabButton = ({ name, tab, activeTab, setActiveTab }: { name: string, tab: AdminTab, activeTab: AdminTab, setActiveTab: (tab: AdminTab) => void }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`px-4 md:px-6 py-3 font-medium text-base md:text-lg transition-colors ${activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-slate-500 hover:text-dark'}`}
  >
    {name}
  </button>
);

const AdminSection = ({ title, loading, showForm, onToggleForm, isEditing, renderForm, renderTable }: { title: string, loading: boolean, showForm: boolean, onToggleForm: () => void, isEditing: boolean, renderForm: () => React.ReactNode, renderTable: () => React.ReactNode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <h2 className="text-2xl md:text-3xl font-bold text-dark font-display">{title}</h2>
      {!isEditing && (
        <Button onClick={onToggleForm} icon={showForm ? <X size={20}/> : <Plus />}>
          {showForm ? 'Cancel' : `Add ${title.slice(0, -1)}`}
        </Button>
      )}
    </div>
    {showForm && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white p-4 md:p-8 rounded-xl shadow-soft mb-12 overflow-hidden">
        {renderForm()}
      </motion.div>
    )}
    {loading ? <div className="text-center py-10"><Loader className="animate-spin mx-auto text-accent" /></div> : renderTable()}
  </motion.div>
);

interface PromptFormProps {
  setFormLoading: (loading: boolean) => void;
  formLoading: boolean;
  onComplete: () => void;
  promptToEdit: Prompt | null;
}

const PromptForm = ({ setFormLoading, formLoading, onComplete, promptToEdit }: PromptFormProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PromptCategory>('Other');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [promptText, setPromptText] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (promptToEdit) {
      setTitle(promptToEdit.title);
      setCategory(promptToEdit.category);
      setPromptText(promptToEdit.prompt_text);
      setInstructions(promptToEdit.instructions);
      setImageFile(null);
    } else {
      // Reset form when adding new
      setTitle('');
      setCategory('Other');
      setPromptText('');
      setInstructions('');
      setImageFile(null);
    }
  }, [promptToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !promptToEdit) {
      toast.error('Please select an image file.');
      return;
    }
    setFormLoading(true);
    const toastId = toast.loading(promptToEdit ? 'Updating prompt...' : 'Uploading prompt...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in.", { id: toastId });
      setFormLoading(false);
      return;
    }

    let imageUrl = promptToEdit?.image_url || '';

    if (imageFile) {
      // If there's an old image and we're uploading a new one, delete the old one.
      if (promptToEdit) {
        const oldFilePath = promptToEdit.image_url.split('/prompt-images/')[1];
        if (oldFilePath) {
          await supabase.storage.from('prompt-images').remove([oldFilePath]);
        }
      }
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('prompt-images').upload(fileName, imageFile);
      if (uploadError) {
        toast.error(uploadError.message, { id: toastId });
        setFormLoading(false);
        return;
      }
      imageUrl = supabase.storage.from('prompt-images').getPublicUrl(uploadData.path).data.publicUrl;
    }
    
    const promptData = { title, category, image_url: imageUrl, prompt_text: promptText, instructions, created_by: user.id };

    if (promptToEdit) {
      const { error } = await supabase.from('prompts').update(promptData).eq('id', promptToEdit.id);
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success('Prompt updated successfully!', { id: toastId });
        onComplete();
      }
    } else {
      const { error } = await supabase.from('prompts').insert([promptData]);
      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success('Prompt added successfully!', { id: toastId });
        onComplete();
      }
    }
    setFormLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl md:text-2xl font-bold text-dark">{promptToEdit ? 'Edit Prompt' : 'Add New Prompt'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
        <select value={category} onChange={e => setCategory(e.target.value as PromptCategory)} required className="w-full p-3 border border-light rounded-lg bg-white">
          {promptCategories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} required={!promptToEdit} className="w-full p-3 border border-light rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"/>
      <textarea placeholder="Prompt Text" value={promptText} onChange={e => setPromptText(e.target.value)} required rows={4} className="w-full p-3 border border-light rounded-lg"/>
      <textarea placeholder="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} required rows={2} className="w-full p-3 border border-light rounded-lg"/>
      <div className="flex gap-4">
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={onComplete} disabled={formLoading}>Cancel</Button>
      </div>
    </form>
  );
};

const PromptsTable = ({ prompts, onEdit, onDelete }: { prompts: Prompt[], onEdit: (p: Prompt) => void, onDelete: (id: number, url: string) => void }) => (
  <div className="bg-white rounded-xl shadow-soft overflow-x-auto">
    <table className="min-w-full divide-y divide-light">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-light">
        {prompts.map(prompt => (
          <tr key={prompt.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-md object-cover" src={prompt.image_url} alt={prompt.title} /></div>
                <div className="ml-4"><div className="text-sm font-medium text-dark">{prompt.title}</div></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/20 text-accent">{prompt.category}</span></td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
              <button onClick={() => onEdit(prompt)} className="text-slate-600 hover:text-accent"><Pencil size={18}/></button>
              <button onClick={() => onDelete(prompt.id, prompt.image_url)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface HeroFormProps {
  setFormLoading: (loading: boolean) => void;
  formLoading: boolean;
  onComplete: () => void;
  heroImageToEdit: HeroImage | null;
}

const HeroImageForm = ({ setFormLoading, formLoading, onComplete, heroImageToEdit }: HeroFormProps) => {
  const [altText, setAltText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (heroImageToEdit) {
      setAltText(heroImageToEdit.alt_text);
      setImageFile(null);
    } else {
      setAltText('');
      setImageFile(null);
    }
  }, [heroImageToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !heroImageToEdit) {
      toast.error('Please select an image file.');
      return;
    }
    setFormLoading(true);
    const toastId = toast.loading(heroImageToEdit ? 'Updating image...' : 'Uploading image...');

    let imageUrl = heroImageToEdit?.image_url || '';

    if (imageFile) {
      if (heroImageToEdit) {
        const oldFilePath = heroImageToEdit.image_url.split('/prompt-images/')[1];
        if (oldFilePath) {
          await supabase.storage.from('prompt-images').remove([oldFilePath]);
        }
      }
      const fileName = `${Date.now()}-hero-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('prompt-images').upload(fileName, imageFile);
      if (uploadError) {
        toast.error(uploadError.message, { id: toastId });
        setFormLoading(false);
        return;
      }
      imageUrl = supabase.storage.from('prompt-images').getPublicUrl(uploadData.path).data.publicUrl;
    }
    
    const heroImageData = { alt_text: altText, image_url: imageUrl };

    if (heroImageToEdit) {
      const { error } = await supabase.from('hero_images').update(heroImageData).eq('id', heroImageToEdit.id);
      if (error) { toast.error(error.message, { id: toastId }); } 
      else { toast.success('Hero image updated!', { id: toastId }); onComplete(); }
    } else {
      const { error } = await supabase.from('hero_images').insert([heroImageData]);
      if (error) { toast.error(error.message, { id: toastId }); }
      else { toast.success('Hero image added!', { id: toastId }); onComplete(); }
    }
    setFormLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl md:text-2xl font-bold text-dark">{heroImageToEdit ? 'Edit Hero Image' : 'Add New Hero Image'}</h3>
      <input type="text" placeholder="Alt Text (for accessibility)" value={altText} onChange={e => setAltText(e.target.value)} required className="w-full p-3 border border-light rounded-lg"/>
      <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} required={!heroImageToEdit} className="w-full p-3 border border-light rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"/>
      <div className="flex gap-4">
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Saving...' : 'Save Changes'}
        </Button>
         <Button variant="outline" onClick={onComplete} disabled={formLoading}>Cancel</Button>
      </div>
    </form>
  );
};

const HeroImagesTable = ({ heroImages, onEdit, onDelete }: { heroImages: HeroImage[], onEdit: (h: HeroImage) => void, onDelete: (id: number, url: string) => void }) => (
  <div className="bg-white rounded-xl shadow-soft overflow-x-auto">
    <table className="min-w-full divide-y divide-light">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Alt Text</th>
          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-light">
        {heroImages.map(image => (
          <tr key={image.id}>
            <td className="px-6 py-4"><img className="h-12 w-20 rounded-md object-cover" src={image.image_url} alt={image.alt_text} /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark hidden sm:table-cell">{image.alt_text}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
              <button onClick={() => onEdit(image)} className="text-slate-600 hover:text-accent"><Pencil size={18}/></button>
              <button onClick={() => onDelete(image.id, image.image_url)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminPage;
