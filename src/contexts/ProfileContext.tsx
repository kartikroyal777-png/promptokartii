import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Profile, UnlockedPrompt, DailyAdClaim, DailyLinkClaim, UserCouponClaim } from '../types';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface ProfileContextType {
  profile: Profile | null;
  unlockedPrompts: string[];
  dailyAdClaims: DailyAdClaim[];
  dailyLinkClaims: DailyLinkClaim[];
  userCouponClaims: UserCouponClaim[];
  promptCost: number;
  loadingProfile: boolean;
  isAdmin: boolean;
  fetchProfile: () => void;
  unlockPrompt: (promptId: string) => Promise<boolean>;
  claimAdReward: (slot: number) => Promise<void>;
  claimTelegramReward: () => Promise<void>;
  claimLinkReward: (linkId: number) => Promise<void>;
  claimCouponReward: (couponCode: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unlockedPrompts, setUnlockedPrompts] = useState<string[]>([]);
  const [dailyAdClaims, setDailyAdClaims] = useState<DailyAdClaim[]>([]);
  const [dailyLinkClaims, setDailyLinkClaims] = useState<DailyLinkClaim[]>([]);
  const [userCouponClaims, setUserCouponClaims] = useState<UserCouponClaim[]>([]);
  const [promptCost, setPromptCost] = useState(1);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setUnlockedPrompts([]);
      setDailyAdClaims([]);
      setDailyLinkClaims([]);
      setUserCouponClaims([]);
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [profileRes, unlockedRes, claimsRes, configRes, linkClaimsRes, couponClaimsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('unlocked_prompts').select('prompt_id').eq('user_id', user.id),
        supabase.from('daily_ad_claims').select('*').eq('user_id', user.id).eq('claim_date', today),
        supabase.from('app_config').select('config_value').eq('config_key', 'prompt_cost').single(),
        supabase.from('daily_link_claims').select('*').eq('user_id', user.id).eq('claim_date', today),
        supabase.from('user_coupon_claims').select('*').eq('user_id', user.id)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (unlockedRes.data) setUnlockedPrompts(unlockedRes.data.map(p => p.prompt_id));
      if (claimsRes.data) setDailyAdClaims(claimsRes.data);
      if (linkClaimsRes.data) setDailyLinkClaims(linkClaimsRes.data);
      if (couponClaimsRes.data) setUserCouponClaims(couponClaimsRes.data);
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

  const updateLocalCredits = (amount: number) => {
    setProfile(currentProfile => {
      if (!currentProfile) return null;
      return {
        ...currentProfile,
        credits: currentProfile.credits + amount,
      };
    });
  };

  const unlockPrompt = async (promptId: string): Promise<boolean> => {
    if (!user || !profile || profile.credits < promptCost) {
      toast.error("Not enough credits!");
      return false;
    }
    
    const originalCredits = profile.credits;
    updateLocalCredits(-promptCost);
    setUnlockedPrompts(prev => [...prev, promptId]);

    const { error } = await supabase.rpc('purchase_prompt', {
      p_prompt_id_in: promptId,
      p_cost_in: promptCost
    });

    if (error) {
      setProfile(p => p ? {...p, credits: originalCredits} : null);
      setUnlockedPrompts(prev => prev.filter(id => id !== promptId));
      toast.error(error.message);
      return false;
    }

    toast.success("Prompt unlocked!");
    return true;
  };

  const claimAdReward = async (slot: number) => {
    if (!user) {
      toast.error("You must be logged in to claim rewards.");
      return;
    }

    const toastId = toast.loading("Verifying your reward...");
    
    updateLocalCredits(3);
    const tempClaimId = Math.random();
    setDailyAdClaims(prev => [...prev, {
        id: tempClaimId,
        user_id: user!.id,
        reward_slot: slot,
        claim_date: new Date().toISOString().split('T')[0],
        claimed_at: new Date().toISOString()
    }]);

    const { error } = await supabase.rpc('claim_ad_reward', { p_reward_slot: slot });

    if (error) {
      updateLocalCredits(-3);
      setDailyAdClaims(prev => prev.filter(c => c.id !== tempClaimId));
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Reward claimed! +3 credits added.", { id: toastId });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const claimTelegramReward = async () => {
    if (!user) {
      toast.error("You must be logged in to claim rewards.");
      return;
    }

    const toastId = toast.loading("Claiming your reward...");
    
    updateLocalCredits(10);
    setProfile(p => p ? {...p, has_claimed_telegram_reward: true} : null);
    
    const { error } = await supabase.rpc('claim_telegram_reward');

    if (error) {
      updateLocalCredits(-10);
      setProfile(p => p ? {...p, has_claimed_telegram_reward: false} : null);
      toast.error(error.message, { id: toastId });
    } else {
      toast.success("Reward claimed! +10 credits added.", { id: toastId });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const claimLinkReward = async (linkId: number) => {
    if (!user) {
      toast.error("You must be logged in to claim rewards.");
      return;
    }

    const toastId = toast.loading("Verifying your reward...");
    
    updateLocalCredits(1);
    const tempClaimId = Math.random();
    setDailyLinkClaims(prev => [...prev, {
        id: tempClaimId,
        user_id: user!.id,
        link_id: linkId,
        claim_date: new Date().toISOString().split('T')[0],
        claimed_at: new Date().toISOString()
    }]);

    const { error } = await supabase.rpc('claim_link_reward', { p_link_id: linkId });

    if (error) {
      updateLocalCredits(-1);
      setDailyLinkClaims(prev => prev.filter(c => c.id !== tempClaimId));
      if (!error.message.includes('already been claimed')) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } else {
      toast.success("Reward claimed! +1 credit added.", { id: toastId });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const claimCouponReward = async (couponCode: string) => {
    if (!user) {
      toast.error("You must be logged in to redeem a code.");
      return;
    }
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    const toastId = toast.loading("Redeeming code...");
    const { data: credits_awarded, error } = await supabase.rpc('claim_coupon_reward', { p_coupon_code: couponCode.trim() });

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      if (credits_awarded > 0) {
        updateLocalCredits(credits_awarded);
        setUserCouponClaims(prev => [...prev, {
            id: Math.random(),
            user_id: user.id,
            coupon_code: couponCode.trim(),
            claimed_at: new Date().toISOString()
        }]);

        toast.success(`Redeemed! +${credits_awarded} credits added.`, { id: toastId });
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } else {
        toast.error("Invalid or already used code.", { id: toastId });
      }
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    profile,
    unlockedPrompts,
    dailyAdClaims,
    dailyLinkClaims,
    userCouponClaims,
    promptCost,
    loadingProfile,
    isAdmin,
    fetchProfile: fetchProfileData,
    unlockPrompt,
    claimAdReward,
    claimTelegramReward,
    claimLinkReward,
    claimCouponReward,
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
