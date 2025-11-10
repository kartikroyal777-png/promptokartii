import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { InstructionsPage } from './pages/InstructionsPage';
import { PromptsPage } from './pages/PromptsPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { UploadPromptPage } from './pages/UploadPromptPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import MainLayout from './layouts/MainLayout';
import { MonetizationGuideModal } from './components/MonetizationGuideModal';
import CreatorPage from './pages/CreatorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
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
          
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/monetization-guide" element={<MainLayout><MonetizationGuideModal isOpen={true} onClose={() => window.history.back()} /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
