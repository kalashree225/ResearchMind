import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { SimpleThemeProvider } from './contexts/SimpleThemeContext';
import { NotificationProvider } from './components/NotificationSystem';
import Dashboard from './pages/Dashboard';
import ChatView from './pages/ChatView';
import HistoryView from './pages/HistoryView';
import LibraryView from './pages/LibraryView';
import ClustersView from './pages/ClustersView';
import EnhancedUpload from './components/EnhancedUpload';

function App() {
  return (
    <SimpleThemeProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<EnhancedUpload />} />
              <Route path="/chat/:id" element={<ChatView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/library" element={<LibraryView />} />
              <Route path="/clusters" element={<ClustersView />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </SimpleThemeProvider>
  );
}

export default App;
