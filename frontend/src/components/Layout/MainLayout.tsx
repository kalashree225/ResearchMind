import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-full flex flex-col overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
        
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
