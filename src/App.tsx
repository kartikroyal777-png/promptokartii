import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PromptsPage from './pages/PromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import InstructionsPage from './pages/InstructionsPage';
import SocialBarAd from './components/ads/SocialBarAd';

function App() {
  return (
    <>
      <SocialBarAd />
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/prompts" element={<MainLayout><PromptsPage /></MainLayout>} />
        <Route path="/prompt/:id" element={<MainLayout><PromptDetailPage /></MainLayout>} />
        <Route path="/instructions" element={<MainLayout><InstructionsPage /></MainLayout>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<MainLayout><AdminPage /></MainLayout>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
