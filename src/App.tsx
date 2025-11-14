import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import InstructionsPage from './pages/InstructionsPage';
import PromptsPage from './pages/PromptsPage';
import PromptDetailPage from './pages/PromptDetailPage';
import UploadPromptPage from './pages/UploadPromptPage';
import MainLayout from './layouts/MainLayout';
import CreatorPage from './pages/CreatorPage';

function App() {
  useEffect(() => {
    const interstitialAdKey = 'interstitialAdShown_session';
    if (!sessionStorage.getItem(interstitialAdKey)) {
      sessionStorage.setItem(interstitialAdKey, 'true');
      
      // This logic replicates the provided interstitial ad script dynamically and safely.
      const s = document.body.appendChild(document.createElement('script'));
      s.dataset.zone = '10186090';
      s.src = 'https://groleegni.net/vignette.min.js';
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/terms" element={<MainLayout><TermsPage /></MainLayout>} />
      <Route path="/privacy" element={<MainLayout><PrivacyPage /></MainLayout>} />
      <Route path="/instructions" element={<MainLayout><InstructionsPage /></MainLayout>} />
      <Route path="/prompts" element={<MainLayout><PromptsPage /></MainLayout>} />
      <Route path="/prompts/:id" element={<MainLayout><PromptDetailPage /></MainLayout>} />
      <Route path="/upload" element={<MainLayout><UploadPromptPage /></MainLayout>} />
      <Route path="/creator/:creatorName" element={<MainLayout><CreatorPage /></MainLayout>} />
    </Routes>
  );
}

export default App;
