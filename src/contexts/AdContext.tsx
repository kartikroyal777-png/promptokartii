import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useProfile } from './ProfileContext';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    show_10046826?: (
        options?: 'pop' | { type: 'inApp', inAppSettings: any }
    ) => Promise<void>;
  }
}

interface AdContextType {
  claimReward: (slot: number) => void;
  isAdReady: boolean;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const AdProvider = ({ children }: { children: ReactNode }) => {
  const [isAdReady, setIsAdReady] = useState(false);
  const { addCredits, recordAdClaim } = useProfile();

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
      if (typeof window.show_10046826 === 'function') setIsAdReady(true);
    };
    
    script.onerror = () => console.error("Ad SDK failed to load.");
    document.body.appendChild(script);

    // Check periodically as some ad blockers might delay loading
    const interval = setInterval(() => {
      if (typeof window.show_10046826 === 'function') {
        setIsAdReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const showAdBySlot = (slot: number): Promise<void> => {
      if (typeof window.show_10046826 !== 'function') {
          return Promise.reject(new Error("Ad function not available"));
      }
      switch(slot) {
          case 1:
              return window.show_10046826(); // Standard rewarded
          case 2:
              return window.show_10046826('pop'); // Rewarded popup
          case 3:
              // This script doesn't return a promise, so we wrap it
              return new Promise((resolve, reject) => {
                  try {
                      window.show_10046826?.({
                          type: 'inApp',
                          inAppSettings: { frequency: 1, capping: 24, interval: 0, timeout: 0, everyPage: false }
                      });
                      // Since there's no callback, we assume success and resolve after a short delay
                      // to allow the ad to potentially show.
                      setTimeout(() => resolve(), 500);
                  } catch (e) {
                      reject(e);
                  }
              });
          default:
              return Promise.reject(new Error("Invalid ad slot"));
      }
  }

  const claimReward = useCallback(async (slot: number) => {
    if (!isAdReady) {
      toast.error('Ads are not available right now. Please try again in a moment.');
      return;
    }

    const toastId = toast.loading('Loading ad...');
    try {
        await showAdBySlot(slot);
        
        toast.dismiss(toastId);
        const success = await addCredits(3);
        
        if (success) {
            await recordAdClaim(slot);
            toast.success('You earned 3 credits!');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            toast.error('Failed to add credits. Please try again.');
        }
    } catch (err) {
        toast.dismiss(toastId);
        console.error(`Error showing ad for slot ${slot}:`, err);
        toast.error('Could not show ad. Please disable ad-blocker or try again.');
    }
  }, [isAdReady, addCredits, recordAdClaim]);

  const value = { 
    claimReward,
    isAdReady,
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
