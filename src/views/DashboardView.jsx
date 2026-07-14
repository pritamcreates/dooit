import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, TrendingUp, Users, Zap, Clock,
  ArrowRight, Star, AlertCircle, Flame
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const QUICK_ACTIONS = [
  { label: 'New Task', icon: <CheckCircle2 size={16} />, color: '#F5B800', path: '/app/tasks' },
  { label: 'New Doc', icon: <Zap size={16} />, color: '#a855f7', path: '/app/docs' },
  { label: 'Calendar', icon: <Clock size={16} />, color: '#22d3ee', path: '/app/calendar' },
  { label: 'Team', icon: <Users size={16} />, color: '#34d399', path: '/app/team' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'task', icon: <CheckCircle2 size={14} />, color: '#22d3ee', text: 'Completed "Update landing page copy"', time: '2m ago' },
  { id: 2, type: 'comment', icon: <Star size={14} />, color: '#F5B800', text: 'Alice commented on "Q4 Roadmap"', time: '15m ago' },
  { id: 3, type: 'alert', icon: <AlertCircle size={14} />, color: '#f87171', text: 'Task "API Integration" is overdue', time: '1h ago' },
  { id: 4, type: 'task', icon: <CheckCircle2 size={14} />, color: '#22d3ee', text: 'Completed "Fix auth bug"', time: '2h ago' },
  { id: 5, type: 'fire', icon: <Flame size={14} />, color: '#fb923c', text: 'You\'re on a 5-day streak! 🔥', time: '3h ago' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col gap-3 hover:border-white/20 transition-all group"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 60%)` }} />

      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <TrendingUp size={14} className="text-green-400 mt-1" />
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-text-dim mt-0.5">{label}</p>
        {sub && <p className="text-xs text-text-dim/60 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function DashboardView() {
  const { tasks } = useStore();
  const navigate = useNavigate();

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const todayCount = tasks.filter(t => t.due === 'Today').length;
  const inProgress = tasks.filter(t => t.col === 'progress').length;
  const completionPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const stats = [
    { label: 'Due Today', value: todayCount, sub: 'tasks need attention', icon: <Clock size={18} />, color: '#F5B800' },
    { label: 'Completed', value: doneCount, sub: `${completionPct}% completion rate`, icon: <CheckCircle2 size={18} />, color: '#34d399' },
    { label: 'In Progress', value: inProgress, sub: 'tasks in flight', icon: <Zap size={18} />, color: '#a855f7' },
    { label: 'Total Tasks', value: tasks.length, sub: 'across all projects', icon: <TrendingUp size={18} />, color: '#22d3ee' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">👋</span>
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()}, <span style={{ color: '#F5B800' }}>Pritam</span>
          </h1>
        </div>
        <p className="text-text-dim ml-10">
          {todayCount > 0
            ? `You have ${todayCount} task${todayCount > 1 ? 's' : ''} due today. Let's get things done!`
            : 'You\'re all caught up for today. Keep the momentum going!'}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#F5B800]" />
              <h2 className="text-white font-semibold">Today's Tasks</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#F5B800]/10 text-[#F5B800] text-xs font-bold">{todayCount}</span>
            </div>
            <button
              onClick={() => navigate('/app/tasks')}
              className="text-xs text-text-dim hover:text-[#F5B800] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {tasks.filter(t => t.due === 'Today').slice(0, 5).map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => navigate('/app/tasks')}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.status === 'Done' ? 'bg-green-400' :
                  task.priority === 'Urgent' ? 'bg-red-400' :
                  task.priority === 'High' ? 'bg-orange-400' : 'bg-[#F5B800]'
                }`} />
                <span className={`flex-1 text-sm ${task.status === 'Done' ? 'text-text-dim line-through' : 'text-white'}`}>
                  {task.title}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  task.priority === 'Urgent' ? 'bg-red-500/15 text-red-400' :
                  task.priority === 'High' ? 'bg-orange-500/15 text-orange-400' :
                  'bg-white/5 text-text-dim'
                }`}>{task.priority}</span>
              </motion.div>
            ))}

            {todayCount === 0 && (
              <div className="flex flex-col items-center justify-center py-14 opacity-40">
                <CheckCircle2 size={36} className="text-green-400 mb-3" />
                <p className="text-white text-sm font-medium">No tasks due today</p>
                <p className="text-text-dim text-xs mt-1">Enjoy your free time! 🎉</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-white font-semibold text-sm mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${action.color}22` }}>
                    <span style={{ color: action.color }}>{action.icon}</span>
                  </div>
                  <span className="text-xs text-text-dim group-hover:text-white transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Progress Ring */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-white font-semibold text-sm mb-4">Overall Progress</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="32" cy="32" r="26" fill="none"
                    stroke="#F5B800" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - completionPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {completionPct}%
                </span>
              </div>
              <div>
                <p className="text-white text-2xl font-bold">{doneCount}<span className="text-text-dim text-sm font-normal">/{tasks.length}</span></p>
                <p className="text-text-dim text-xs mt-0.5">tasks completed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y divide-white/5">
          {RECENT_ACTIVITY.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-center gap-4 px-6 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}22` }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <p className="flex-1 text-sm text-text-dim">{item.text}</p>
              <span className="text-xs text-text-dim/50 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
