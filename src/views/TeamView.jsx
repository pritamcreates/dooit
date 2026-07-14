import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Video, MessageSquare, Search, UserPlus, Shield, Star } from 'lucide-react';

const TEAM_MEMBERS = [];


const STATUS_STYLES = {
  online: { dot: 'bg-green-400', label: 'Online' },
  away:   { dot: 'bg-yellow-400', label: 'Away' },
  offline: { dot: 'bg-gray-500', label: 'Offline' },
};

export default function TeamView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = TEAM_MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const onlineCount = TEAM_MEMBERS.filter(m => m.status === 'online').length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Team Directory</h1>
          <div className="flex items-center gap-3">
            <p className="text-text-dim text-sm">{TEAM_MEMBERS.length} members</p>
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {onlineCount} online
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_20px_rgba(245,184,0,0.2)]">
          <UserPlus size={16} /> Invite Member
        </button>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-7"
      >
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search team members…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-[#F5B800]/50 transition-colors"
          />
        </div>
        {['all', 'online', 'away', 'offline'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === f
                ? 'bg-[#F5B800] text-black border-[#F5B800]'
                : 'text-text-dim border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Team Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((member, i) => {
          const st = STATUS_STYLES[member.status];
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex flex-col gap-4 hover:border-white/20 hover:bg-white/[0.06] transition-all overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${member.badgeColor}18, transparent 60%)` }}
              />

              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-white/10 border border-white/10"
                  />
                  {/* Status dot */}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${st.dot} border-2 border-[#0d0d0d]`} />
                </div>
                {/* Badge */}
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: `${member.badgeColor}20`, color: member.badgeColor }}
                >
                  {member.badge}
                </span>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-white font-semibold text-base">{member.name}</h3>
                <p className="text-text-dim text-sm mt-0.5">{member.role}</p>
                <p className="text-text-dim/50 text-xs mt-1 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 pt-3 border-t border-white/5">
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{member.tasks}</p>
                  <p className="text-text-dim text-xs">Tasks</p>
                </div>
                <div className="w-px bg-white/5" />
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{member.projects}</p>
                  <p className="text-text-dim text-xs">Projects</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 text-text-dim hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
                >
                  <MessageSquare size={13} /> Message
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 text-text-dim hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
                >
                  <Mail size={13} /> Email
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-text-dim hover:text-[#F5B800] hover:border-[#F5B800]/30 transition-all"
                >
                  <Video size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <Users size={48} className="text-text-dim mb-4" />
          <p className="text-white text-lg font-semibold">No members found</p>
          <p className="text-text-dim text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
