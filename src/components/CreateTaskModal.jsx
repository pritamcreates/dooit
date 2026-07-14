import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CreateTaskModal({ isOpen, onClose }) {
  const { addTask } = useStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [col, setCol] = useState('todo');
  const [due, setDue] = useState('Today');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTask({
      title,
      priority,
      col,
      due,
      status: col === 'done' ? 'Done' : 'Todo'
    });
    
    setTitle('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Create New Task</h2>
            <button onClick={onClose} className="p-2 text-text-dim hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">Task Title</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5B800] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5B800] transition-colors appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">Project Phase</label>
                <select 
                  value={col}
                  onChange={(e) => setCol(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F5B800] transition-colors appearance-none"
                >
                  <option value="todo">To Do</option>
                  <option value="progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-text-dim font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2 bg-[#F5B800] text-black font-bold rounded-lg hover:bg-[#F5B800]/90 transition-colors shadow-[0_0_15px_rgba(245,184,0,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                <Check size={16} /> Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
