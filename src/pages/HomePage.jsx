import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Zap, Users, Command,
  CheckCircle2, BarChart2, Calendar, FileText,
  Star, Shield, Globe, ChevronDown, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* Custom Spring presets */
const SPRING_TRANSITION = { type: 'spring', stiffness: 380, damping: 30 };

/* Grid Background */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* Subtle ambient orbs */
function FloatingOrbs() {
  return (
    <>
      <div
        className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full blur-[160px] pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.05) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full blur-[160px] pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)' }}
      />
    </>
  );
}

/* Initials Avatar */
function InitialsAvatar({ name, color, size = 28 }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.35,
        border: '2px solid #0a0a0a',
      }}
    >
      {initials}
    </div>
  );
}

/* Feature Cards Data */
const FEATURES = [
  {
    icon: <CheckCircle2 size={22} />, color: '#F5B800',
    title: 'Smart Task Management',
    desc: 'Drag-and-drop boards, smart filters, and priority queues. Every task tracked, nothing slips through.',
  },
  {
    icon: <BarChart2 size={22} />, color: '#a855f7',
    title: 'Real-Time Analytics',
    desc: 'Live dashboards with completion rates, heatmaps, and velocity metrics. Always know where your team stands.',
  },
  {
    icon: <Users size={22} />, color: '#22d3ee',
    title: 'Team Collaboration',
    desc: 'Shared docs, threaded comments, mentions, and real-time presence. Work together seamlessly.',
  },
  {
    icon: <Calendar size={22} />, color: '#34d399',
    title: 'Unified Calendar',
    desc: 'All your tasks, meetings, and milestones in one place. Plan sprints and never miss a deadline.',
  },
  {
    icon: <FileText size={22} />, color: '#f87171',
    title: 'Collaborative Docs',
    desc: 'Write, share, and organize your knowledge base. From meeting notes to product specs, always at hand.',
  },
  {
    icon: <Zap size={22} />, color: '#fb923c',
    title: 'Lightning Fast',
    desc: 'Built on a local-first architecture with sub-50ms interactions. Feels native, works anywhere.',
  },
];

/* Testimonials */
const TESTIMONIALS = [
  {
    quote: 'Our team velocity increased by 40% in the first month. Dooit completely changed how we work.',
    name: 'Sarah Chen', role: 'CTO at Vercel Labs',
    color: '#F5B800',
  },
  {
    quote: 'The best workspace tool I have ever used. The UI is incredibly fast and the UX is just beautiful.',
    name: 'Marcus Wright', role: 'Engineering Lead',
    color: '#a855f7',
  },
  {
    quote: 'We onboarded our entire company in one afternoon. Setup was painless and the design is stunning.',
    name: 'Priya Sharma', role: 'Head of Product',
    color: '#22d3ee',
  },
];

/* Social proof users */
const PROOF_USERS = [
  { name: 'Alex Kim', color: '#F5B800' },
  { name: 'Priya S', color: '#a855f7' },
  { name: 'Ben T', color: '#22d3ee' },
  { name: 'Sara M', color: '#34d399' },
  { name: 'Luke R', color: '#f87171' },
];

/* Interactive App Mockup Component for Sandbox Demo */
function AppMockup() {
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: 'Design onboarding flow', done: true, w: 90 },
    { id: 2, title: 'Implement hotkey listeners', done: false, w: 75 },
    { id: 3, title: 'Setup Firestore collections rules', done: false, w: 85 },
    { id: 4, title: 'Add trial billing wall warning', done: true, w: 60 }
  ]);

  const toggleTask = (id) => {
    setDemoTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const doneCount = demoTasks.filter(t => t.done).length;
  const progressPct = Math.round((doneCount / demoTasks.length) * 100);

  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)] bg-[#0d0d0d]">
      {/* Window header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-black/60">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-[#555]">
            <Command size={11} /> Search anything...
            <span className="ml-2 text-[10px] px-1 bg-black/50 rounded text-[#444] border border-white/5">Cmd K</span>
          </div>
        </div>
      </div>

      <div className="flex h-[420px]">
        {/* Sidebar */}
        <div className="w-52 border-r border-white/5 p-4 bg-black/30 flex flex-col gap-3">
          <div className="w-20 h-3 bg-white/10 rounded mb-3" />
          {[
            { label: 'Dashboard', active: true, color: '#F5B800' },
            { label: 'My Tasks', active: false },
            { label: 'Projects', active: false },
            { label: 'Calendar', active: false },
            { label: 'Analytics', active: false },
          ].map(item => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${item.active ? 'bg-white/5' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-[#F5B800]' : 'bg-[#333]'}`} />
              <div
                className="h-2.5 rounded"
                style={{
                  width: `${item.label.length * 6}px`,
                  background: item.active ? '#FFF' : 'rgba(255,255,255,0.12)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Main interactive area */}
        <div className="flex-1 p-6 bg-[#0d0d0d] flex flex-col gap-4">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '24', label: 'Tasks Due', color: '#94a3b8' },
              { val: `${progressPct}%`, label: 'Completion', color: '#F5B800' },
              { val: '6', label: 'Team Online', color: '#a855f7' },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/[0.02] p-3 text-left">
                <p className="font-bold text-xl" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#555' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Interactive tasks box */}
          <div className="rounded-xl bg-white/[0.015] p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-24 bg-white/15 rounded" />
              <span className="text-[10px] text-text-dim/50">Click items to toggle</span>
            </div>
            <div className="flex flex-col gap-2">
              {demoTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="flex items-center gap-3 py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    t.done ? 'border-[#F5B800] bg-[#F5B800]/20' : 'border-white/20 group-hover:border-white/40'
                  }`}>
                    {t.done && <div className="w-1.5 h-1.5 rounded-full bg-[#F5B800]" />}
                  </div>
                  <span className={`text-xs transition-all ${
                    t.done ? 'text-white/30 line-through' : 'text-white/80'
                  }`}>
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Interactive Mini Chart */}
          <div className="rounded-xl bg-white/[0.015] p-4">
            <div className="h-3 w-28 bg-white/15 rounded mb-3" />
            <div className="flex items-end gap-2 h-14">
              {[35, 60, 48, 75, 55, 90, 68].map((h, i) => {
                const isSelected = i === Math.floor(progressPct / 15);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: isSelected ? '#F5B800' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Navbar with Scroll-spy CTA */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 180);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-xl' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="w-28">
          <img src="/logo.png" alt="Dooit" className="w-full h-auto object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#777]">
          {['Features', 'Pricing', 'Changelog', 'Docs'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/signin" className="text-sm font-medium text-[#777] hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <Link
            to="/signin"
            className="px-5 py-2.5 rounded-full bg-[#F5B800] text-black text-sm font-bold hover:bg-[#F5B800]/90 transition-all shadow-[0_0_20px_rgba(245,184,0,0.25)] flex items-center gap-2 group"
          >
            Get Started <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <button className="md:hidden text-[#777] hover:text-white" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-4"
          >
            {['Features', 'Pricing', 'Changelog', 'Docs'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-[#777] hover:text-white text-sm font-medium transition-colors" onClick={() => setMobileOpen(false)}>
                {l}
              </a>
            ))}
            <Link to="/signin" className="w-full mt-2 py-3 rounded-full bg-[#F5B800] text-black text-sm font-bold text-center" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* Main Page Component */
export default function HomePage() {
  const { scrollY } = useScroll();
  const mockupY = useTransform(scrollY, [0, 600], [0, -50]);
  const mockupOpacity = useTransform(scrollY, [300, 700], [1, 0.3]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <GridBackground />
      <FloatingOrbs />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
        {/* Headline - clean white, no gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ...SPRING_TRANSITION }}
          className="text-5xl sm:text-6xl lg:text-[80px] font-black tracking-tighter leading-[1.05] mb-6 max-w-5xl text-white"
        >
          The workspace that
          <br />
          <span className="text-[#F5B800]">actually works.</span>
        </motion.h1>

        {/* Subheading - no competitor names */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ...SPRING_TRANSITION }}
          className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed mb-10 font-light"
        >
          One beautifully unified workspace for your tasks, docs, calendar, analytics, and team.
          Built for teams who want to move fast and stay focused.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ...SPRING_TRANSITION }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <Link
            to="/signin"
            className="group flex items-center gap-2 px-8 py-4 rounded-full bg-[#F5B800] text-black font-black text-base hover:bg-[#F5B800]/90 transition-all shadow-[0_0_40px_rgba(245,184,0,0.3)]"
          >
            Start for free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Social Proof with initials avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 text-[#666] text-sm"
        >
          <div className="flex -space-x-2">
            {PROOF_USERS.map((u) => (
              <InitialsAvatar key={u.name} name={u.name} color={u.color} size={28} />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#F5B800" className="text-[#F5B800]" />)}
          </div>
          <span><strong className="text-white">4,200+</strong> teams already love Dooit</span>
        </motion.div>

        {/* App Mockup with scroll parallax */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: mockupY, opacity: mockupOpacity }}
          className="w-full max-w-5xl mt-20 relative"
        >
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none rounded-b-2xl" />
          <AppMockup />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted By */}
      <section className="relative py-14 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-white/20 text-xs font-semibold uppercase tracking-widest mb-8">Trusted by growing teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {['Hyperion', 'Cascade', 'Luminary', 'Vortex', 'Apex Labs', 'Meridian'].map(co => (
              <span key={co} className="text-white/18 font-black text-lg tracking-tight hover:text-white/35 transition-colors cursor-default">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#666] mb-5">
              Everything you need
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 text-white">Built for momentum.</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
              Every tool your team needs, stripped of bloat. Designed for speed, focus, and deep collaboration.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ...SPRING_TRANSITION }}
                className="group relative p-7 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all overflow-hidden cursor-default"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${f.color}08, transparent 65%)` }}
                />
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                  style={{ background: `${f.color}10` }}
                >
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-24 px-6 border-y border-white/5 bg-white/[0.01]"
      >
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          {[
            { num: '4,200+', label: 'Active teams', color: '#94a3b8' },
            { num: '2.4M', label: 'Tasks completed', color: '#a855f7' },
            { num: '99.9%', label: 'Uptime SLA', color: '#34d399' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ...SPRING_TRANSITION }}
            >
              <p className="text-5xl sm:text-6xl font-black mb-2" style={{ color: s.color }}>{s.num}</p>
              <p className="text-white/40 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-3 text-white">Loved by builders.</h2>
            <p className="text-white/35">Real feedback from real teams.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, ...SPRING_TRANSITION }}
                className="relative p-7 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#F5B800" className="text-[#F5B800]" />)}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={t.name} color={t.color} size={38} />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 relative overflow-hidden border-y border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Shield size={13} className="text-[#F5B800]" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
              Free for teams up to 5 members, no credit card needed
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 text-white leading-tight">Ready to move faster?</h2>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            Join 4,200+ teams who have already made the switch.
            Set up your workspace in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signin"
              className="group flex items-center gap-2 px-10 py-4 rounded-full bg-[#F5B800] text-black font-black text-base hover:bg-[#F5B800]/90 transition-all shadow-[0_0_40px_rgba(245,184,0,0.3)]"
            >
              Get started free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-white/25 text-sm flex items-center gap-2">
              <Globe size={14} /> Works on all devices
            </span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-20">
            <img src="/logo.png" alt="Dooit" className="w-full h-auto object-contain opacity-50" />
          </div>
          <p className="text-white/20 text-xs">2026 Dooit Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-white/25 text-xs">
            {['Privacy', 'Terms', 'Security'].map(l => (
              <a key={l} href="#" className="hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
