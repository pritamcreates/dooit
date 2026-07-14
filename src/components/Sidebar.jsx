import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, Inbox, FolderOpen, Users, Settings, HelpCircle, LayoutDashboard, BookOpen, Calendar, BarChart2, Plug, LayoutTemplate, Zap, ShoppingBag, BookOpenCheck, LifeBuoy } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
  { name: 'Dashboard', path: '/app', icon: <LayoutDashboard size={18} /> },
  { name: 'Inbox', path: '/app/inbox', icon: <Inbox size={18} /> },
  { name: 'My Tasks', path: '/app/tasks', icon: <CheckCircle2 size={18} /> },
  { name: 'Projects', path: '/app/projects', icon: <FolderOpen size={18} /> },
  { name: 'Team', path: '/app/team', icon: <Users size={18} /> },
  { name: 'Docs', path: '/app/docs', icon: <BookOpen size={18} /> },
  { name: 'Calendar', path: '/app/calendar', icon: <Calendar size={18} /> },
  { name: 'People', path: '/app/people', icon: <LifeBuoy size={18} /> },
  { name: 'Analytics', path: '/app/analytics', icon: <BarChart2 size={18} /> },

];

  return (
    <aside className="w-64 border-r border-white/5 bg-surface/50 backdrop-blur-xl flex flex-col h-screen p-4 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-28 flex items-center justify-center">
          <img src="/logo.png" alt="Dooit" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 flex-1">
        <span className="px-2 text-xs font-semibold text-text-dim mb-2 uppercase tracking-wider">Workspace</span>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#F5B800]/10 text-[#F5B800]' 
                  : 'text-text-dim hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
        <NavLink 
          to="/app/settings" 
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-[#F5B800]/10 text-[#F5B800]' 
                : 'text-text-dim hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
        
      </div>
    </aside>
  );
}
