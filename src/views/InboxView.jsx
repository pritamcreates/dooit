import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AtSign, CheckCircle2, MessageSquare, Zap, Check, Trash2 } from 'lucide-react';

const ALL_NOTIFICATIONS = [];


const TABS = [
  { key: 'all', label: 'All' },
  { key: 'mentions', label: 'Mentions' },
  { key: 'tasks', label: 'Assignments' },
  { key: 'updates', label: 'Updates' },
];

export default function InboxView() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.tab === activeTab);

  const unread = filtered.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="p-8 max-w-3xl mx-auto h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Inbox</h1>
          <p className="text-text-dim text-sm">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-text-dim hover:text-white transition-all"
            >
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 w-fit"
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === tab.key
                ? 'bg-[#F5B800] text-black shadow-lg'
                : 'text-text-dim hover:text-white'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && notifications.filter(n => n.tab === tab.key && n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />
            )}
          </button>
        ))}
      </motion.div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 opacity-40"
            >
              <Bell size={48} className="text-text-dim mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Inbox zero!</h2>
              <p className="text-text-dim text-sm">No notifications in this category.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative flex gap-4 p-4 rounded-2xl border transition-all group ${
                    notif.unread
                      ? 'bg-[#F5B800]/[0.05] border-[#F5B800]/20 hover:border-[#F5B800]/40'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  {/* Unread indicator */}
                  {notif.unread && (
                    <span className="absolute left-3 top-5 w-1.5 h-1.5 rounded-full bg-[#F5B800]" />
                  )}

                  {/* Avatar + type badge */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={notif.avatar}
                      alt={notif.name}
                      className="w-11 h-11 rounded-full bg-white/10 object-cover"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0d0d0d]"
                      style={{ background: `${notif.iconColor}33` }}
                    >
                      <span style={{ color: notif.iconColor }}>{notif.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-white font-semibold text-sm">{notif.name}</span>
                        <span className="text-text-dim text-sm"> {notif.title}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-text-dim/50 text-xs whitespace-nowrap">{notif.time}</span>
                      </div>
                    </div>
                    <p className="text-text-dim text-xs mt-1 leading-relaxed">{notif.body}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/5 text-text-dim text-[10px] font-medium border border-white/10">
                      {notif.project}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {notif.unread && (
                      <button
                        onClick={() => markRead(notif.id)}
                        title="Mark as read"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-green-400 hover:bg-green-400/10 transition-all"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      title="Delete"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
