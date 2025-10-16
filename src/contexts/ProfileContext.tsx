import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Profile, UnlockedPrompt, DailyAdClaim, AppConfig } from '../types';
import toast from 'react-hot-toast';

interface ProfileContextType {
  profile: Profile | null;
  unlockedPrompts: string[];
  dailyClaims: DailyAdClaim[];
  promptCost: number;
  loadingProfile: boolean;
  isAdmin: boolean;
  fetchProfile: () => void;
  unlockPrompt: (promptId: string) => Promise<boolean>;
  addCredits: (amount: number) => Promise<boolean>;
  recordAdClaim: (slot: number) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unlockedPrompts, setUnlockedPrompts] = useState<string[]>([]);
  const [dailyClaims, setDailyClaims] = useState<DailyAdClaim[]>([]);
  const [promptCost, setPromptCost] = useState(1);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setUnlockedPrompts([]);
      setDailyClaims([]);
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [profileRes, unlockedRes, claimsRes, configRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('unlocked_prompts').select('prompt_id').eq('user_id', user.id),
        supabase.from('daily_ad_claims').select('*').eq('user_id', user.id).eq('claim_date', today),
        supabase.from('app_config').select('config_value').eq('config_key', 'prompt_cost').single()
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (unlockedRes.data) setUnlockedPrompts(unlockedRes.data.map(p => p.prompt_id));
      if (claimsRes.data) setDailyClaims(claimsRes.data);
      if (configRes.data) setPromptCost(parseInt(configRes.data.config_value, 10) || 1);

    } catch (error) {
      console.error("Error fetching user profile data:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfileData();
    }
  }, [authLoading, fetchProfileData]);

  const unlockPrompt = async (promptId: string): Promise<boolean> => {
    if (!user || !profile || profile.credits < promptCost) {
      toast.error("Not enough credits!");
      return false;
    }

    const { error } = await supabase.rpc('purchase_prompt', {
      p_prompt_id_in: promptId,
      p_cost_in: promptCost
    });

    if (error) {
      toast.error(error.message);
      return false;
    }

    toast.success("Prompt unlocked!");
    await fetchProfileData(); // Refresh all data
    return true;
  };

  const addCredits = async (amount: number): Promise<boolean> => {
    if (!user || !profile) return false;
    
    const { data, error } = await supabase.rpc('add_credits', {
      user_id: user.id,
      amount: amount
    });

    if (error) {
      toast.error(error.message);
      return false;
    }
    
    await fetchProfileData();
    return true;
  };

  const recordAdClaim = async (slot: number) => {
    if (!user) return;
    const { error } = await supabase.from('daily_ad_claims').insert({
      user_id: user.id,
      reward_slot: slot
    });
    if (error) {
      console.error("Failed to record ad claim", error);
    } else {
      await fetchProfileData();
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    profile,
    unlockedPrompts,
    dailyClaims,
    promptCost,
    loadingProfile,
    isAdmin,
    fetchProfile: fetchProfileData,
    unlockPrompt,
    addCredits,
    recordAdClaim,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
