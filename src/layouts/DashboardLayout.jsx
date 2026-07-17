import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import CommandPalette from '../components/CommandPalette';
import ShortcutHelperModal from '../components/ShortcutHelperModal';
import { useStore } from '../context/StoreContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { isFocusMode, setIsFocusMode } = useStore();

  // Global listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Avoid triggering shortcuts inside inputs
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(v => !v);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(v => !v);
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setIsFocusMode(v => !v);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setIsFocusMode]);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-white font-inter">
      {/* Sidebar with Spring animation collapse */}
      <AnimatePresence initial={false}>
        {!isFocusMode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="overflow-hidden h-screen flex-shrink-0"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Glow effects specific to dashboard */}
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <AnimatePresence initial={false}>
          {!isFocusMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 64, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="overflow-hidden flex-shrink-0"
            >
              <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-1 overflow-y-auto z-10 relative">
          {/* Quick HUD indicator for Focus Mode */}
          {isFocusMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 z-50 bg-[#121212] border border-white/10 px-3 py-1.5 rounded-xl text-xs text-text-dim flex items-center gap-2 pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Focus Mode active <kbd className="bg-white/10 px-1 rounded text-white text-[10px]">Z</kbd> to exit
            </motion.div>
          )}

          <Outlet />
        </main>
      </div>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      <ShortcutHelperModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
