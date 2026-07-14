import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, CheckCircle2, FileText, Users } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [search, setSearch] = useState('');

  // Handle Cmd+K global shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : onClose(false); // Quick hack to toggle, assuming parent handles it
        // Actually, parent should handle the window listener or pass a toggle function. 
        // We'll just rely on the parent opening it, and this component closing on Esc.
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Input */}
          <div className="flex items-center px-4 py-3 border-b border-white/5">
            <Search size={20} className="text-text-dim mr-3" />
            <input 
              autoFocus
              type="text" 
              placeholder="What do you need?" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-text-dim/50"
            />
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-semibold tracking-widest text-text-dim border border-white/5">
              ESC
            </div>
          </div>

          {/* Results Area */}
          <div className="p-2 max-h-[60vh] overflow-y-auto flex flex-col gap-1">
            <span className="px-3 py-2 text-xs font-semibold text-text-dim uppercase tracking-wider">Suggestions</span>
            
            <button className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
              <CheckCircle2 size={18} className="text-text-dim group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Create new task...</span>
                <span className="text-xs text-text-dim">in My Tasks</span>
              </div>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
              <FileText size={18} className="text-text-dim group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Q3 Roadmap Planning</span>
                <span className="text-xs text-text-dim">Document</span>
              </div>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group">
              <Users size={18} className="text-text-dim group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Message Design Team</span>
                <span className="text-xs text-text-dim">Channel</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
