import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import ChatView from './pages/ChatView';
import HistoryView from './pages/HistoryView';
import LibraryView from './pages/LibraryView';
import ClustersView from './pages/ClustersView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:id" element={<ChatView />} />
          <Route path="/history" element={<HistoryView />} />
          <Route path="/library" element={<LibraryView />} />
          <Route path="/clusters" element={<ClustersView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
