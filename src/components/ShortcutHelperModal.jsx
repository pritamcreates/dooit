import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

const SHORTCUTS = [
  { key: '?', desc: 'Toggle Shortcut Cheatsheet' },
  { key: 'Z', desc: 'Toggle Full-Screen Focus Mode' },
  { key: 'Esc', desc: 'Close any active modal or menu' },
  { key: 'Cmd K', desc: 'Toggle Search Command Palette' },
];

export default function ShortcutHelperModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Command size={18} className="text-[#F5B800]" /> Keyboard Shortcuts
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-text-dim hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {SHORTCUTS.map(s => (
              <div key={s.key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/50 text-sm font-medium">{s.desc}</span>
                <kbd className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white shadow-sm flex items-center justify-center min-w-[28px]">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
