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
import EarnCreditsPage from './pages/EarnCreditsPage';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
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
        <Route path="/earn" element={<PageWrapper><EarnCreditsPage /></PageWrapper>} />
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
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20 pb-28">
          <AnimatedRoutes />
        </main>
        <BottomNavBar />
      </div>
    </>
  );
}

export default App;
