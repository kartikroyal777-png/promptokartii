import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Coins, CheckCircle, Loader, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAd } from '../contexts/AdContext';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const EarnCreditsPage: React.FC = () => {
  const { claimReward, isAdReady } = useAd();
  const { profile, dailyClaims, loadingProfile, claimTelegramReward } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claimingTelegram, setClaimingTelegram] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleClaimTelegram = async () => {
    setClaimingTelegram(true);
    window.open('https://t.me/+2kmMIBggTIsxNzc1', '_blank');
    await claimTelegramReward();
    setClaimingTelegram(false);
  };

  const adRewards = [
    { slot: 1, amount: 3 },
    { slot: 2, amount: 3 },
    { slot: 3, amount: 3 },
  ];

  const totalClaimed = dailyClaims.length;
  const totalAvailable = adRewards.length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6 sm:p-8 lg:p-10"
      >
        <div className="text-center mb-12">
          <Gift className="w-16 h-16 mx-auto text-amber-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-dark font-display mb-4">Earn Daily Credits</h1>
          <p className="text-lg text-slate-600">Complete tasks to earn credits for unlocking prompts.</p>
          <div className="mt-4 text-sm font-bold text-slate-500">
            {`Ad claims remaining today: ${totalAvailable - totalClaimed} / ${totalAvailable}`}
          </div>
        </div>

        {loadingProfile ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin w-8 h-8 text-accent" />
          </div>
        ) : (
          <motion.div
            className="max-w-md mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${
                profile?.has_claimed_telegram_reward ? 'bg-slate-100 border-slate-200' : 'bg-sky-50 border-sky-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  profile?.has_claimed_telegram_reward ? 'bg-slate-200' : 'bg-sky-100'
                }`}>
                  <Send className={`w-6 h-6 ${profile?.has_claimed_telegram_reward ? 'text-slate-500' : 'text-sky-500'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark">Join our Telegram</h3>
                  <p className="text-slate-600 font-bold text-lg">+5 Credits</p>
                </div>
              </div>
              <Button
                onClick={handleClaimTelegram}
                disabled={profile?.has_claimed_telegram_reward || claimingTelegram}
                variant={profile?.has_claimed_telegram_reward ? 'secondary' : 'primary'}
                className={
                  profile?.has_claimed_telegram_reward 
                  ? 'bg-slate-300 hover:bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-sky-500 hover:bg-sky-600'
                }
              >
                {profile?.has_claimed_telegram_reward ? (
                  <CheckCircle size={20} />
                ) : claimingTelegram ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  'Join & Claim'
                )}
              </Button>
            </motion.div>

            {adRewards.map(reward => {
              const isClaimed = dailyClaims.some(c => c.reward_slot === reward.slot);
              return (
                <motion.div
                  key={reward.slot}
                  variants={itemVariants}
                  className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${
                    isClaimed ? 'bg-slate-100 border-slate-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isClaimed ? 'bg-slate-200' : 'bg-amber-100'
                    }`}>
                      <Coins className={`w-6 h-6 ${isClaimed ? 'text-slate-500' : 'text-amber-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">Watch Ad</h3>
                      <p className="text-slate-600 font-bold text-lg">+{reward.amount} Credits</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => claimReward(reward.slot)}
                    disabled={isClaimed || !isAdReady}
                    variant={isClaimed ? 'secondary' : 'primary'}
                    className={isClaimed ? 'bg-slate-300 hover:bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}
                  >
                    {isClaimed ? <CheckCircle size={20} /> : 'Claim'}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EarnCreditsPage;
