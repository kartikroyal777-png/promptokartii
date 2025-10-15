import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdOverlay from '../components/AdOverlay';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AdContextType {
  showAd: (targetUrl: string, promptId: string) => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
};

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const [adState, setAdState] = useState<{
    isVisible: boolean;
    targetUrl: string | null;
    promptId: string | null;
  }>({ isVisible: false, targetUrl: null, promptId: null });
  
  const navigate = useNavigate();

  const showAd = (targetUrl: string, promptId: string) => {
    setAdState({ isVisible: true, targetUrl, promptId });
  };

  const handleAdComplete = useCallback(async (success: boolean) => {
    if (success && adState.promptId) {
      const visitorId = getVisitorId();
      // We don't have payout, country, offer_id from this script.
      // We will insert what we have.
      const { error } = await supabase.from('ad_views').insert({
        user_id: visitorId,
        prompt_id: adState.promptId,
      });

      if (error) {
        console.error('Failed to record ad view:', error);
      }
    }
    
    if (adState.targetUrl) {
      navigate(adState.targetUrl);
    }
    setAdState({ isVisible: false, targetUrl: null, promptId: null });
  }, [adState.targetUrl, adState.promptId, navigate]);

  const value = { showAd };

  return (
    <AdContext.Provider value={value}>
      {children}
      <AdOverlay
        isVisible={adState.isVisible}
        onComplete={handleAdComplete}
      />
    </AdContext.Provider>
  );
};

export const useAd = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};
