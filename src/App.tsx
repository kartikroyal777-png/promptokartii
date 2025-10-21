import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import PromptsPage from './pages/PromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNavBar from './components/BottomNavBar';
import InstructionsPage from './pages/InstructionsPage';

// Ad Components
import Ad160x300 from './components/ads/Ad160x300';
import Ad300x250 from './components/ads/Ad300x250';
import Ad728x90 from './components/ads/Ad728x90';
import Ad468x60 from './components/ads/Ad468x60';
import Ad320x50 from './components/ads/Ad320x50';
import GlobalAdScripts from './components/ads/GlobalAdScripts';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/prompts" element={<PageWrapper><PromptsPage /></PageWrapper>} />
        <Route path="/prompt/:id" element={<PageWrapper><PromptDetailPage /></PageWrapper>} />
        <Route path="/instructions" element={<PageWrapper><InstructionsPage /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><AuthPage /></PageWrapper>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <GlobalAdScripts />

      {/* Desktop Left Sidebar Ad */}
      <aside className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-30">
        <Ad160x300 />
      </aside>

      {/* Main Content */}
      <main className="flex-grow pt-20 pb-32 lg:pb-20 lg:px-[192px] xl:px-[284px] 2xl:px-[332px]">
        {/* Top Banner Ad */}
        <div className="container mx-auto mb-4 flex justify-center">
          <div className="hidden lg:block"><Ad728x90 /></div>
          <div className="hidden md:block lg:hidden"><Ad468x60 /></div>
        </div>
        <AnimatedRoutes />
      </main>

      {/* Desktop Right Sidebar Ad */}
      <aside className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-30">
        <Ad300x250 />
      </aside>

      {/* Mobile Bottom Banner Ad */}
      <aside className="block md:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-30">
        <Ad320x50 />
      </aside>

      <BottomNavBar />
    </div>
  );
}

export default App;
