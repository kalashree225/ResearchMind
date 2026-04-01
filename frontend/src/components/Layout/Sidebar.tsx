import { NavLink } from 'react-router-dom';
import { BookOpen, Map, History, PlusSquare, BrainCircuit, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useChatSessions } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const Sidebar = () => {
  const { data: sessions } = useChatSessions();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const links = [
    { icon: <PlusSquare size={18} />, label: 'New Project', path: '/dashboard' },
    { icon: <History size={18} />, label: 'History', path: '/history' },
    { icon: <Map size={18} />, label: 'Topic Clusters', path: '/clusters' },
    { icon: <BookOpen size={18} />, label: 'Library', path: '/library' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-border flex flex-col pt-6 pb-4 shadow-sm">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary flex items-center justify-center text-white shadow-md">
          <BrainCircuit size={18} />
        </div>
        <span className="font-display font-bold text-xl tracking-wide text-text-primary">Research<span className="text-secondary">Mind</span></span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/20 text-primary-600 border border-primary-500/30 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border hover:border-border/50 border border-transparent'
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        
        <div className="mt-8 mb-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
          Recent Papers
        </div>
        <div className="space-y-1">
          {sessions?.slice(0, 3).map((session) => (
            <NavLink
              key={session.id}
              to={`/chat/${session.id}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 truncate',
                  isActive
                    ? 'text-text-primary bg-surface-hover'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50'
                )
              }
            >
              <div className="w-1.5 h-1.5 rounded-full bg-border" />
              <span className="truncate">{session.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 mt-auto space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
