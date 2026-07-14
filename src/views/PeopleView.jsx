import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, UserPlus, Mail } from 'lucide-react';

export default function PeopleView() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">People</h1>
          <p className="text-text-dim text-sm">Manage and invite people to your workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-text-dim hover:text-white hover:bg-white/10 text-sm font-medium rounded-xl transition-all">
            <Mail size={15} /> Invite via Email
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_20px_rgba(245,184,0,0.2)]">
            <UserPlus size={15} /> Add Member
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-sm mb-10"
      >
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <input
          type="text"
          placeholder="Search people by name or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-text-dim focus:outline-none focus:border-[#F5B800]/50 transition-colors"
        />
      </motion.div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        {/* Illustration */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-[#F5B800]/10 blur-2xl scale-150" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center">
            <Users size={52} className="text-white/20" />
          </div>

          {/* Floating avatar dots */}
          {[
            { top: '-8px', left: '-8px', color: '#F5B800', delay: 0.4 },
            { top: '-8px', right: '-8px', color: '#a855f7', delay: 0.5 },
            { bottom: '-8px', left: '-8px', color: '#22d3ee', delay: 0.6 },
            { bottom: '-8px', right: '-8px', color: '#34d399', delay: 0.7 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: dot.delay, type: 'spring' }}
              className="absolute w-10 h-10 rounded-full border-2 border-background flex items-center justify-center"
              style={{ ...dot, background: `${dot.color}22`, borderColor: `${dot.color}44` }}
            >
              <span className="text-lg font-bold" style={{ color: dot.color }}>?</span>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">No team members yet</h2>
        <p className="text-text-dim text-sm max-w-sm leading-relaxed mb-8">
          Invite people to your workspace to collaborate on tasks, projects, docs, and more. They'll show up here once they join.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_24px_rgba(245,184,0,0.25)]">
            <UserPlus size={16} /> Invite Your First Member
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-white/10 text-text-dim hover:text-white hover:bg-white/10 text-sm font-medium rounded-xl transition-all">
            <Mail size={15} /> Send Email Invitation
          </button>
        </div>

        {/* Feature Hints */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-xl w-full">
          {[
            { emoji: '👥', title: 'Collaborate', desc: 'Share tasks & projects with your team' },
            { emoji: '💬', title: 'Communicate', desc: 'Message team members directly' },
            { emoji: '📊', title: 'Track Progress', desc: 'See who\'s working on what' },
          ].map(hint => (
            <div key={hint.title} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
              <div className="text-2xl mb-2">{hint.emoji}</div>
              <p className="text-white text-sm font-semibold mb-1">{hint.title}</p>
              <p className="text-text-dim text-xs leading-relaxed">{hint.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
