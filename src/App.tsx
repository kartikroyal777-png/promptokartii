import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PromptsPage from './pages/PromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import UploadPromptPage from './pages/UploadPromptPage';
import InstructionsPage from './pages/InstructionsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import GlobalAdScripts from './components/GlobalAdScripts';

function App() {
  return (
    <>
      <GlobalAdScripts />
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/prompts" element={<MainLayout><PromptsPage /></MainLayout>} />
        <Route path="/prompt/:id" element={<MainLayout><PromptDetailPage /></MainLayout>} />
        <Route path="/upload" element={<MainLayout><UploadPromptPage /></MainLayout>} />
        <Route path="/instructions" element={<MainLayout><InstructionsPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
        <Route path="/terms-of-service" element={<MainLayout><TermsPage /></MainLayout>} />
      </Routes>
    </>
  );
}

export default App;
