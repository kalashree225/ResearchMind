import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeSelector from '../ThemeSelector';
import GlobalSearch from '../GlobalSearch';
import { NotificationBell } from '../NotificationSystem';
import UserProfile from '../UserProfile';
import { useSimpleTheme } from '../../contexts/SimpleThemeContext';

const MainLayout = () => {
  const { theme } = useSimpleTheme();

  return (
    <div className="flex w-full h-screen" style={{ backgroundColor: theme.background }}>
      <Sidebar />
      <main className="flex-1 relative h-full flex flex-col overflow-hidden">
        {/* Background Effects */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" 
          style={{ backgroundColor: theme.primary + '10' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" 
          style={{ backgroundColor: theme.primary + '10' }}
        />
        
        {/* Header with Search and Controls */}
        <header 
          className="relative z-10 border-b backdrop-blur-md" 
          style={{ 
            backgroundColor: theme.surface, 
            borderColor: theme.border
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 max-w-2xl">
              <GlobalSearch />
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <ThemeSelector />
              <UserProfile />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
