import React, { ReactNode } from 'react';

// This context and provider have been deprecated as per user request.
// It provided functionality for Monetag rewarded ads, which have been removed.

interface AdContextType {
  claimReward: (slot: number) => Promise<void>;
  isAdReady: boolean;
  isClaiming: number | null;
}

// Mock implementation to prevent crashes in case of residual usage.
const mockAdContext: AdContextType = {
  claimReward: async () => {
    console.warn('claimReward is deprecated and has no effect.');
  },
  isAdReady: false,
  isClaiming: null,
};

export const AdProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useAd = () => {
  return mockAdContext;
};
