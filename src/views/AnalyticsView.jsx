import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, TrendingDown, CheckCircle2, Clock, Users, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const WEEKLY_DATA = [
  { week: 'Mon', completed: 8,  total: 12 },
  { week: 'Tue', completed: 14, total: 16 },
  { week: 'Wed', completed: 10, total: 15 },
  { week: 'Thu', completed: 18, total: 20 },
  { week: 'Fri', completed: 15, total: 18 },
  { week: 'Sat', completed: 6,  total: 8  },
  { week: 'Sun', completed: 4,  total: 5  },
];

const HEATMAP_DATA = Array.from({ length: 52 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => ({
    week: wi, day: di,
    count: Math.floor(Math.random() * 8),
  }))
);

function getHeatColor(count) {
  if (count === 0) return 'rgba(255,255,255,0.05)';
  if (count <= 2)  return '#F5B80040';
  if (count <= 4)  return '#F5B80070';
  if (count <= 6)  return '#F5B800a0';
  return '#F5B800';
}

function MetricCard({ label, value, sub, icon, color, trend, trendUp, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 group hover:border-white/20 transition-all"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 60%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trend}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-text-dim font-medium">{label}</p>
      {sub && <p className="text-xs text-text-dim/60 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export default function AnalyticsView() {
  const { tasks } = useStore();
  const [hoveredBar, setHoveredBar] = useState(null);

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.col === 'progress').length;
  const completionPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const maxBarVal = Math.max(...WEEKLY_DATA.map(d => d.total));

  const metrics = [
    { label: 'Total Tasks', value: tasks.length, sub: 'across all projects', icon: <CheckCircle2 size={18} />, color: '#F5B800', trend: '+12%', trendUp: true },
    { label: 'Completed', value: doneCount, sub: `${completionPct}% completion rate`, icon: <Zap size={18} />, color: '#34d399', trend: '+8%', trendUp: true },
    { label: 'In Progress', value: inProgress, sub: 'tasks in flight', icon: <Clock size={18} />, color: '#a855f7', trend: '+3%', trendUp: true },
    { label: 'Team Members', value: 6, sub: 'active this week', icon: <Users size={18} />, color: '#22d3ee', trend: '-1', trendUp: false },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <BarChart2 className="text-[#F5B800]" size={28} /> Analytics
          </h1>
          <p className="text-text-dim text-sm">Track productivity and performance across your workspace.</p>
        </div>
        <div className="flex gap-2">
          {['7D', '30D', '90D'].map(r => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                r === '7D' ? 'bg-[#F5B800]/10 border-[#F5B800]/30 text-[#F5B800]' : 'border-white/10 text-text-dim hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} delay={i * 0.08} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Tasks Completed — This Week</h2>
            <div className="flex items-center gap-4 text-xs text-text-dim">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-[#F5B800] inline-block" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-white/15 inline-block" /> Total</span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-40">
            {WEEKLY_DATA.map((d, i) => {
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={d.week}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div className="bg-[#181818] border border-white/10 rounded-lg px-2 py-1 text-center mb-1">
                      <p className="text-white text-xs font-bold">{d.completed}</p>
                      <p className="text-text-dim text-[9px]">done</p>
                    </div>
                  )}
                  <div className="relative w-full flex flex-col justify-end" style={{ height: `${(d.total / maxBarVal) * 100}%` }}>
                    {/* Background bar */}
                    <div className="absolute inset-0 rounded-t-lg bg-white/5" />
                    {/* Completed bar */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: `${(d.completed / d.total) * 100}%`,
                        originY: 'bottom',
                        background: isHovered
                          ? 'linear-gradient(to top, #F5B800, #fde68a)'
                          : 'linear-gradient(to top, #F5B800cc, #F5B80055)'
                      }}
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all"
                    />
                  </div>
                  <span className="text-text-dim text-xs font-medium">{d.week}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Completion Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col items-center justify-center"
        >
          <h2 className="text-white font-semibold text-sm mb-6 self-start">Completion Rate</h2>
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
              <motion.circle
                cx="72" cy="72" r="60" fill="none"
                stroke="url(#analyticsGrad)" strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 60}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 60 * (1 - completionPct / 100)}` }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5B800" />
                  <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{completionPct}%</span>
              <span className="text-text-dim text-xs mt-1">completion</span>
            </div>
          </div>
          <div className="mt-6 w-full space-y-2">
            {[
              { label: 'Done', count: doneCount, color: '#34d399' },
              { label: 'In Progress', count: inProgress, color: '#F5B800' },
              { label: 'To Do', count: tasks.filter(t => t.col === 'todo').length, color: '#94a3b8' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-text-dim text-xs">{item.label}</span>
                </div>
                <span className="text-white text-xs font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h2 className="text-white font-semibold mb-4">Activity Heatmap — Last 12 Months</h2>
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="flex gap-1" style={{ minWidth: '700px' }}>
            {HEATMAP_DATA.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <div
                    key={`${wi}-${cell.day}`}
                    title={`${cell.count} tasks`}
                    className="w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer"
                    style={{ background: getHeatColor(cell.count) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-text-dim/60 text-xs">Less</span>
          {[0,2,4,6,8].map(v => (
            <div key={v} className="w-3 h-3 rounded-sm" style={{ background: getHeatColor(v) }} />
          ))}
          <span className="text-text-dim/60 text-xs">More</span>
        </div>
      </motion.div>
    </div>
  );
}
