import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { SimpleThemeProvider } from './contexts/SimpleThemeContext';
import { NotificationProvider } from './components/NotificationSystem';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import ChatView from './pages/ChatView';
import HistoryView from './pages/HistoryView';
import LibraryView from './pages/LibraryView';
import DebugClustersView from './pages/DebugClustersView';
import EnhancedUpload from './components/EnhancedUpload';

function App() {
  return (
    <SimpleThemeProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<EnhancedUpload />} />
              <Route path="/chat/:id" element={<ChatView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/library" element={<LibraryView />} />
              <Route path="/clusters" element={<DebugClustersView />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </SimpleThemeProvider>
  );
}

export default App;
