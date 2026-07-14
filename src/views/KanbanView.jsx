import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, MessageSquare, Calendar, Tag } from 'lucide-react';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useStore } from '../context/StoreContext';

const COLUMNS = [
  { id: 'todo',     title: 'To Do',       color: '#94a3b8', dotColor: 'bg-slate-400',  headerBg: 'from-slate-500/10' },
  { id: 'progress', title: 'In Progress', color: '#F5B800', dotColor: 'bg-[#F5B800]',  headerBg: 'from-[#F5B800]/10' },
  { id: 'review',  title: 'In Review',   color: '#a855f7', dotColor: 'bg-purple-400', headerBg: 'from-purple-500/10' },
  { id: 'done',    title: 'Done',         color: '#34d399', dotColor: 'bg-green-400',  headerBg: 'from-green-500/10' },
];

const PRIORITY_STYLES = {
  Urgent: { bg: 'bg-red-500/15', text: 'text-red-400' },
  High:   { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  Medium: { bg: 'bg-[#F5B800]/15', text: 'text-[#F5B800]' },
  Low:    { bg: 'bg-white/5', text: 'text-text-dim' },
};

const TAG_COLORS = ['#F5B800', '#a855f7', '#22d3ee', '#34d399', '#f87171'];

function TaskCard({ task, onClick, onDragStart }) {
  const p = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low;
  const tagColor = TAG_COLORS[task.title.length % TAG_COLORS.length];
  return (
    <motion.div
      layout
      layoutId={`task-${task.id}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-[#181818] border border-white/8 rounded-2xl p-4 shadow-lg hover:border-white/20 cursor-grab active:cursor-grabbing group transition-colors"
    >
      {/* Priority + Menu */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${p.bg} ${p.text}`}>
          {task.priority}
        </span>
        <button className="text-text-dim opacity-0 group-hover:opacity-100 hover:text-white transition-all p-0.5 rounded">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-white mb-3 leading-snug">{task.title}</h4>

      {/* Tag */}
      <div className="mb-3">
        <span
          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${tagColor}18`, color: tagColor }}
        >
          <Tag size={9} /> Design
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-text-dim text-xs">
              <MessageSquare size={11} /> {task.comments}
            </span>
          )}
          {task.due && (
            <span className="flex items-center gap-1 text-text-dim text-xs">
              <Calendar size={11} /> {task.due}
            </span>
          )}
        </div>
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5B800] to-orange-500 flex-shrink-0" />
      </div>
    </motion.div>
  );
}

export default function KanbanView() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dragging, setDragging] = useState(null);
  const { tasks, moveTask } = useStore();

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    setDragging(taskId);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, colId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('taskId');
    if (id) moveTask(id, colId);
    setDragging(null);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 flex-shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Projects Board</h1>
          <p className="text-text-dim text-sm">Drag and drop tasks across columns to update status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['Felix', 'Aria', 'Bob'].map((seed, i) => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`}
                alt={seed}
                className="w-8 h-8 rounded-full border-2 border-background bg-white/10"
                style={{ zIndex: 3 - i }}
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-xs text-text-dim z-0">
              +4
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_20px_rgba(245,184,0,0.2)]"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </motion.div>

      {/* Board Columns */}
      <div className="flex gap-5 flex-1 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map((col, ci) => {
          const colTasks = tasks.filter(t => t.col === col.id);
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.08 }}
              className="flex-1 min-w-[280px] max-w-[320px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-4 px-3 py-3 rounded-2xl bg-gradient-to-r ${col.headerBg} to-transparent border border-white/5`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="font-semibold text-white text-sm">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-text-dim">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-text-dim hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                {colTasks.length === 0 && (
                  <div className="flex-1 min-h-[120px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-text-dim/40 text-xs gap-2">
                    <Plus size={18} />
                    <span>Drop tasks here</span>
                  </div>
                )}
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  />
                ))}
                {/* Add Button */}
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full py-3 rounded-2xl border border-dashed border-white/10 text-text-dim text-sm font-medium hover:border-white/25 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/[0.03] mt-1"
                >
                  <Plus size={14} /> Add Task
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <TaskDetailModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} />
      <CreateTaskModal isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
