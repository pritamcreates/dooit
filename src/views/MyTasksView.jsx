import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, Calendar as CalendarIcon,
  MessageSquare, Plus, Filter, LayoutList, GitCommit
} from 'lucide-react';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useStore } from '../context/StoreContext';

const TABS = ['All', 'Today', 'Upcoming', 'Timeline', 'Completed'];

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
      className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.04] transition-all cursor-pointer shadow-sm hover:shadow"
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
          task.status === 'Done'
            ? 'bg-green-500/10 border-green-500'
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

  // Calculate dynamic cycle metrics based on completion times (difference between Date.now and creation id)
  const completedTasks = tasks.filter(t => t.status === 'Done');
  const totalCompletedTime = completedTasks.reduce((acc, t) => {
    const start = Number(t.id);
    if (!isNaN(start)) {
      // Mock difference capped to make it realistic (e.g. 25 mins to 3 hours)
      const diffMinutes = Math.min(180, Math.max(15, Math.floor((Date.now() - start) / 60000)));
      return acc + diffMinutes;
    }
    return acc + 30;
  }, 0);

  const avgCycleTime = completedTasks.length > 0
    ? Math.round(totalCompletedTime / completedTasks.length)
    : 0;

  // Mock Git Commit integration logic
  const handleSimulateGitCommit = async () => {
    const todoTasks = tasks.filter(t => t.status !== 'Done');
    if (todoTasks.length === 0) return;
    // Choose first todo task and mark it complete mimicking Git Commit Hook
    const targetTask = todoTasks[0];
    await toggleTaskStatus(targetTask.id);
  };

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
        <div className="flex items-center gap-2">
          {tasks.filter(t => t.status !== 'Done').length > 0 && (
            <button
              onClick={handleSimulateGitCommit}
              title="Simulate push commit hook closing first open task"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-xs rounded-xl transition-all"
            >
              <GitCommit size={14} className="text-[#34d399]" /> Git Hook
            </button>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_24px_rgba(245,184,0,0.25)]"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </motion.div>

      {/* Quick metrics bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Progress Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-dim font-medium">Overall Completion</span>
            <span className="text-xs font-bold text-white">{completionPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-[#F5B800]"
            />
          </div>
        </motion.div>

        {/* Cycle Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim font-medium">Average Cycle Time</p>
              <p className="text-xl font-bold text-[#34d399] mt-1">
                {avgCycleTime > 0 ? `${avgCycleTime} mins` : 'N/A'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock size={15} className="text-[#34d399]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs + Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-between mb-5"
      >
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-text-dim hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-dim hover:text-white bg-white/5 border border-white/5 rounded-xl transition-all hover:bg-white/10">
          <Filter size={14} /> Filter
        </button>
      </motion.div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {activeTab === 'Timeline' ? (
            /* Contextual Timeline View replacing the generic calendar view */
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {['Today', 'Upcoming', 'Later'].map(col => {
                const colTasks = tasks.filter(t => {
                  if (col === 'Today') return t.due === 'Today' && t.status !== 'Done';
                  if (col === 'Upcoming') return t.due !== 'Today' && t.status !== 'Done';
                  return t.status === 'Done';
                });

                return (
                  <div key={col} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-xs font-bold text-white/60">{col}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 font-semibold text-text-dim">
                        {colTasks.length}
                      </span>
                    </div>
                    {colTasks.length === 0 ? (
                      <div className="h-24 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-xs text-text-dim/40 bg-white/[0.005]">
                        Empty
                      </div>
                    ) : (
                      colTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTask(t)}
                          className="p-3 bg-white/[0.015] border border-white/5 rounded-xl hover:border-white/10 cursor-pointer transition-all text-left"
                        >
                          <p className="text-xs font-semibold text-white/80 line-clamp-2">{t.title}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[9px] text-text-dim">{t.priority}</span>
                            <span className="text-[9px] text-[#F5B800]">{t.due || 'No date'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </motion.div>
          ) : filtered.length === 0 ? (
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
