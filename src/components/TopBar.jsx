import React, { useState, useRef, useEffect } from 'react';
import { Command, Bell, Settings, LogOut, User, ChevronRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1, unread: true, type: 'mention',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aria&backgroundColor=b6e3f4',
    title: 'Alice mentioned you', body: 'Hey, can you review the Q4 roadmap?',
    time: '2m ago',
  },
  {
    id: 2, unread: true, type: 'task',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Bob&backgroundColor=c0aede',
    title: 'Task assigned to you', body: '"Design the onboarding flow" is now yours.',
    time: '18m ago',
  },
  {
    id: 3, unread: false, type: 'comment',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Carol&backgroundColor=d1d4f9',
    title: 'Carol commented', body: 'Looks great! Just a few minor tweaks needed.',
    time: '1h ago',
  },
  {
    id: 4, unread: false, type: 'update',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=ffd5dc',
    title: 'Project status updated', body: '"Website Redesign" moved to In Review.',
    time: '3h ago',
  },
];

export default function TopBar({ onOpenCommandPalette }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const dismissNotif = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">

      {/* Search Hint */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-text-dim group"
      >
        <Command size={14} className="group-hover:text-white transition-colors" />
        <span className="text-sm font-medium group-hover:text-white transition-colors">Search anything...</span>
        <div className="flex items-center gap-1 ml-4 px-1.5 py-0.5 rounded bg-black/50 text-[10px] font-semibold tracking-widest text-text-dim border border-white/5">
          <span>⌘</span>K
        </div>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-text-dim hover:text-white hover:bg-white/10 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#F5B800] rounded-full text-[9px] font-bold text-black flex items-center justify-center ring-2 ring-background">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-96 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <h3 className="text-white font-semibold text-sm">Notifications</h3>
                  <p className="text-text-dim text-xs mt-0.5">{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#F5B800] hover:text-[#F5B800]/80 flex items-center gap-1 transition-colors"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                    <Bell size={32} className="text-text-dim mb-3" />
                    <p className="text-white text-sm font-medium">All caught up!</p>
                    <p className="text-text-dim text-xs mt-1">No new notifications.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-5 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group relative ${notif.unread ? 'bg-[#F5B800]/5' : ''}`}
                    >
                      {/* Unread dot */}
                      {notif.unread && (
                        <span className="absolute left-2 top-5 w-1.5 h-1.5 bg-[#F5B800] rounded-full" />
                      )}
                      <img src={notif.avatar} alt="" className="w-9 h-9 rounded-full flex-shrink-0 bg-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{notif.title}</p>
                        <p className="text-text-dim text-xs mt-0.5 leading-relaxed line-clamp-1">{notif.body}</p>
                        <p className="text-text-dim/60 text-[10px] mt-1">{notif.time}</p>
                      </div>
                      <button
                        onClick={(e) => dismissNotif(notif.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-dim hover:text-white rounded-lg hover:bg-white/10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/5">
                <button className="text-xs text-text-dim hover:text-white transition-colors flex items-center gap-1">
                  View all notifications <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5B800]/30 to-purple-600/30 border-2 border-[#F5B800]/50 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-none">Pritam C.</p>
              <p className="text-[10px] text-text-dim mt-0.5">Admin</p>
            </div>
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in">
              {/* User Info */}
              <div className="px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#F5B800]/50 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Pritam Chhetri</p>
                    <p className="text-text-dim text-xs">pritam@dooit.app</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => { navigate('/app/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-dim hover:text-white hover:bg-white/10 transition-all"
                >
                  <User size={15} /> Profile
                </button>
                <button
                  onClick={() => { navigate('/app/settings'); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-dim hover:text-white hover:bg-white/10 transition-all"
                >
                  <Settings size={15} /> Settings
                </button>
                <div className="my-1 border-t border-white/5" />
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
