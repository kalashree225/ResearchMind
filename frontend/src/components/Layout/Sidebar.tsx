import { NavLink } from 'react-router-dom';
import { BookOpen, Map, History, PlusSquare, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useChatSessions } from '../../hooks/useChat';
import { useSimpleTheme } from '../../contexts/SimpleThemeContext';

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const Sidebar = () => {
  const { data: sessions } = useChatSessions();
  const { theme } = useSimpleTheme() || { theme: { surface: '#ffffff', border: '#e0e0e0', primary: '#1976d2', text: '#000000', textSecondary: '#666666' } };

  const links = [
    { icon: <PlusSquare size={18} />, label: 'New Project', path: '/dashboard' },
    { icon: <History size={18} />, label: 'History', path: '/history' },
    { icon: <Map size={18} />, label: 'Topic Clusters', path: '/clusters' },
    { icon: <BookOpen size={18} />, label: 'Library', path: '/library' },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col pt-6 pb-4 shadow-sm" style={{
      backgroundColor: theme?.surface || '#ffffff',
      borderRightColor: theme?.border || '#e0e0e0',
      borderRightWidth: '1px'
    }}>
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md" style={{ backgroundColor: theme?.primary }}>
          <BrainCircuit size={18} />
        </div>
        <span className="font-display font-bold text-xl tracking-wide" style={{ color: theme?.text }}>
          Research<span style={{ color: theme?.primary }}>Mind</span>
        </span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200'
            }
            style={({ isActive }: any) => ({
              backgroundColor: isActive ? (theme?.primary || '#1976d2') + '20' : 'transparent',
              color: isActive ? (theme?.primary || '#1976d2') : (theme?.textSecondary || '#666666'),
              border: `1px solid ${isActive ? (theme?.primary || '#1976d2') + '40' : 'transparent'}`,
            }) as React.CSSProperties}
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
        {/* Logout button removed - no auth needed */}
      </div>
    </aside>
  );
};

export default Sidebar;
