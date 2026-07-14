import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, Calendar as CalendarIcon,
  MessageSquare, Plus, Filter, LayoutList
} from 'lucide-react';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useStore } from '../context/StoreContext';

const TABS = ['All', 'Today', 'Upcoming', 'Completed'];

const PRIORITY_STYLES = {
  Urgent: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
  High:   { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400' },
  Medium: { bg: 'bg-[#F5B800]/15', text: 'text-[#F5B800]', dot: 'bg-[#F5B800]' },
  Low:    { bg: 'bg-white/5', text: 'text-text-dim', dot: 'bg-gray-500' },
};

function TaskRow({ task, onClick, onToggle, delay = 0 }) {
  const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay, duration: 0.25 }}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/15 transition-all cursor-pointer"
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          task.status === 'Done'
            ? 'bg-green-500/20 border-green-500'
            : 'border-white/20 hover:border-[#F5B800]'
        }`}
      >
        {task.status === 'Done' && <CheckCircle2 size={11} className="text-green-400" />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium ${task.status === 'Done' ? 'text-text-dim line-through' : 'text-white'}`}>
        {task.title}
      </span>

      {/* Meta */}
      <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
        {task.comments > 0 && (
          <div className="flex items-center gap-1 text-text-dim text-xs">
            <MessageSquare size={12} />
            <span>{task.comments}</span>
          </div>
        )}
        {task.due && (
          <div className="flex items-center gap-1 text-text-dim text-xs">
            <CalendarIcon size={12} />
            <span>{task.due}</span>
          </div>
        )}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.bg} ${p.text}`}>
          {task.priority}
        </span>
      </div>
    </motion.div>
  );
}

export default function MyTasksView() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { tasks, toggleTaskStatus } = useStore();

  const filtered = tasks.filter(t => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Today') return t.due === 'Today';
    if (activeTab === 'Upcoming') return t.due !== 'Today' && t.status !== 'Done';
    if (activeTab === 'Completed') return t.status === 'Done';
    return true;
  });

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const completionPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Tasks</h1>
          <p className="text-text-dim text-sm">
            {doneCount} of {tasks.length} tasks completed
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_24px_rgba(245,184,0,0.25)]"
        >
          <Plus size={16} /> New Task
        </button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 rounded-2xl border border-white/10 bg-white/[0.03]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-dim font-medium">Overall Completion</span>
          <span className="text-xs font-bold text-[#F5B800]">{completionPct}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#F5B800] to-yellow-300"
          />
        </div>
      </motion.div>

      {/* Tabs + Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-between mb-5"
      >
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#F5B800] text-black shadow'
                  : 'text-text-dim hover:text-white'
              }`}
            >
              {tab}
              {tab === 'Today' && tasks.filter(t => t.due === 'Today').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded-full bg-red-500/20 text-red-400 font-bold">
                  {tasks.filter(t => t.due === 'Today').length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-dim hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
          <Filter size={14} /> Filter
        </button>
      </motion.div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 opacity-40"
            >
              <LayoutList size={48} className="text-text-dim mb-4" />
              <h2 className="text-xl font-bold text-white mb-1">No tasks here</h2>
              <p className="text-text-dim text-sm">
                {activeTab === 'Completed' ? "You haven't completed any tasks yet." : "Create a task to get started."}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  delay={i * 0.04}
                  onClick={() => setSelectedTask(task)}
                  onToggle={toggleTaskStatus}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <TaskDetailModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} />
      <CreateTaskModal isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
