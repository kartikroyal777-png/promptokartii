import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useProfile } from './ProfileContext';

// Add type definition to window
declare global {
  interface Window {
    show_10046826?: (
      options?: 'pop' | { type: 'inApp'; inAppSettings: any }
    ) => Promise<void>;
  }
}

interface AdContextType {
  claimReward: (slot: number) => Promise<void>;
  isAdReady: boolean;
  isClaiming: number | null; // To disable specific button while claiming
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [isClaiming, setIsClaiming] = useState<number | null>(null);
  const { claimAdReward: grantCreditsOnBackend } = useProfile();

  // Load the ad SDK
  useEffect(() => {
    const scriptId = 'rewarded-ad-sdk';
    if (document.getElementById(scriptId)) {
      if (typeof window.show_10046826 === 'function') setIsAdReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = '//libtl.com/sdk.js';
    script.async = true;
    script.dataset.zone = '10046826';
    
    script.onload = () => {
      if (typeof window.show_10046826 === 'function') {
        setIsAdReady(true);
      }
    };
    
    script.onerror = () => {
      console.error("Ad SDK failed to load.");
      toast.error("Ad service failed to load. Please check your network or ad-blocker settings.");
    };
    document.body.appendChild(script);

    // Periodically check for the function in case of delay
    const interval = setInterval(() => {
      if (typeof window.show_10046826 === 'function') {
        setIsAdReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => {
        clearInterval(interval);
        const existingScript = document.getElementById(scriptId);
        if (existingScript && document.body.contains(existingScript)) {
            document.body.removeChild(existingScript);
        }
    };
  }, []);

  const showAdBySlot = (slot: number): Promise<void> => {
    if (typeof window.show_10046826 !== 'function') {
        return Promise.reject(new Error("Ad function not available"));
    }
    switch(slot) {
        case 1:
            return window.show_10046826(); // Rewarded Interstitial
        case 2:
            return window.show_10046826('pop'); // Rewarded Popup
        case 3:
            // The 'inApp' type is for non-rewarded, automatic ads and doesn't return a promise.
            // To ensure a consistent rewarded experience, we'll reuse the standard rewarded interstitial for this slot.
            return window.show_10046826(); // Rewarded Interstitial
        default:
            return Promise.reject(new Error("Invalid ad slot"));
    }
  }

  const claimReward = useCallback(async (slot: number) => {
    if (!isAdReady) {
      toast.error('Ads are not available. This might be due to an ad-blocker or network issues. Please try again later.');
      return;
    }
    if (isClaiming) return; // Prevent multiple claims at once

    setIsClaiming(slot);
    const toastId = toast.loading('Loading ad...');

    try {
        await showAdBySlot(slot);
        
        toast.dismiss(toastId);
        // The backend RPC handles credit addition and daily claim tracking.
        await grantCreditsOnBackend(slot);
        
    } catch (err) {
        toast.dismiss(toastId);
        console.error(`Error showing ad for slot ${slot}:`, err);
        toast.error('Could not show ad. Please disable your ad-blocker and try again.');
    } finally {
        setIsClaiming(null);
    }
  }, [isAdReady, isClaiming, grantCreditsOnBackend]);

  const value = { 
    claimReward,
    isAdReady,
    isClaiming,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
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
