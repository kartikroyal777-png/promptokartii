import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle, Loader, ExternalLink, Ticket } from 'lucide-react';
import Button from '../components/ui/Button';
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
  const { dailyLinkClaims, loadingProfile, claimLinkReward, claimCouponReward } = useProfile();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [claimingLink, setClaimingLink] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin w-8 h-8 text-accent" />
        </div>
      </div>
    );
  }

  const directLinks = [
    { id: 1, url: 'https://www.effectivegatecpm.com/yv2dihg0?key=6d6f482c33a4fc253329508411b3ebcf' },
    { id: 2, url: 'https://www.effectivegatecpm.com/dqdi4per7?key=28d5c65d01f3ff9eb728e9b36b0a2c91' },
    { id: 3, url: 'https://www.effectivegatecpm.com/ei44j61zw?key=eb626ffbc41e0387b00166e77d317bc3' },
    { id: 4, url: 'https://www.effectivegatecpm.com/z9u235ch?key=9db92e6b3e9323862a673c196e2bcce3' },
    { id: 5, url: 'https://www.effectivegatecpm.com/ue21c0x7?key=b7881078d41f6f8f119ffd9a19df2e12' },
    { id: 6, url: 'https://www.effectivegatecpm.com/r9uswu8rz6?key=f15a4e042b73ed4db7a17a5f14e9f4d0' },
    { id: 7, url: 'https://www.effectivegatecpm.com/swcnervz8f?key=7164efb3c02d4717a0c965b67eb15850' },
    { id: 8, url: 'https://www.effectivegatecpm.com/ntu8pkz7wa?key=42262ec74cad12e41b2ef31ffcc4e793' },
    { id: 9, url: 'https://www.effectivegatecpm.com/z4qutykyzi?key=ae55038489a5bf8ed466adf7456587f4' },
    { id: 10, url: 'https://www.effectivegatecpm.com/im4kym18j6?key=63c870b394075eafae85c86303ef0f2a' },
  ];
  
  const handleClaimLink = async (linkId: number, url: string) => {
    setClaimingLink(linkId);
    window.open(url, '_blank');
    await claimLinkReward(linkId);
    setClaimingLink(null);
  };

  const handleRedeemCoupon = async () => {
    setIsRedeeming(true);
    await claimCouponReward(couponCode);
    setCouponCode('');
    setIsRedeeming(false);
  };

  const totalClaimed = dailyLinkClaims.length;
  const totalAvailable = directLinks.length;
  const mobileButtonClass = "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm whitespace-nowrap";

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
            {`Daily claims remaining: ${totalAvailable - totalClaimed} / ${totalAvailable}`}
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
            {directLinks.map(link => {
              const isClaimed = dailyLinkClaims.some(c => c.link_id === link.id);
              const isThisOneClaiming = claimingLink === link.id;
              return (
                <motion.div
                  key={`link-${link.id}`}
                  variants={itemVariants}
                  className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${
                    isClaimed ? 'bg-slate-100 border-slate-200' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isClaimed ? 'bg-slate-200' : 'bg-emerald-100'
                    }`}>
                      <ExternalLink className={`w-6 h-6 ${isClaimed ? 'text-slate-500' : 'text-emerald-500'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">{`Daily Link #${link.id}`}</h3>
                      <p className="text-slate-600 font-bold text-lg">+1 Credit</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClaimLink(link.id, link.url)}
                    disabled={isClaimed || !!claimingLink}
                    variant={isClaimed ? 'secondary' : 'primary'}
                    className={`${mobileButtonClass} ${
                      isClaimed || !!claimingLink
                        ? 'bg-slate-300 hover:bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                  >
                    {isClaimed ? (
                      <CheckCircle size={20} />
                    ) : isThisOneClaiming ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      'Claim'
                    )}
                  </Button>
                </motion.div>
              );
            })}

            <motion.div
              variants={itemVariants}
              className="p-6 rounded-xl border-2 bg-indigo-50 border-indigo-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100">
                  <Ticket className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark">Redeem a Coupon</h3>
                  <p className="text-slate-600">Have a code? Enter it here for credits!</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full p-3 border border-light rounded-lg focus:ring-accent focus:border-accent transition"
                    disabled={isRedeeming}
                  />
                  <Button
                    onClick={handleRedeemCoupon}
                    disabled={isRedeeming || !couponCode.trim()}
                    variant="primary"
                    className={`${mobileButtonClass} bg-indigo-500 hover:bg-indigo-600`}
                  >
                    {isRedeeming ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      'Redeem'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Example: KARTIK...200</p>
              </div>
            </motion.div>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EarnCreditsPage;
