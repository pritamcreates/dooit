import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import CommandPalette from '../components/CommandPalette';

export default function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-white font-inter">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        {/* Glow effects specific to dashboard */}
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        
        <main className="flex-1 overflow-y-auto z-10 relative">
          <Outlet />
        </main>
      </div>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
