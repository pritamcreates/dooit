import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlignLeft, MessageSquare, Send, CheckCircle2, MoreHorizontal, Paperclip, Smile } from 'lucide-react';

export default function TaskDetailModal({ isOpen, onClose, task }) {
  const [activeTab, setActiveTab] = useState('doc'); // mobile view fallback
  
  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
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
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-6xl h-full max-h-[85vh] bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between px-6 py-4 border-b border-white/5 bg-background/50">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-text-dim text-sm font-medium">
                <CheckCircle2 size={16} />
                Mark Complete
              </button>
              <div className="h-4 w-px bg-white/10"></div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F5B800]/10 text-[#F5B800]">
                {task.priority || 'Normal'} Priority
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-text-dim hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <MoreHorizontal size={20} />
              </button>
              <button onClick={onClose} className="p-2 text-text-dim hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body Split */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* LEFT: Notion-style Document */}
            <div className="flex-1 overflow-y-auto border-r border-white/5 p-8 custom-scrollbar bg-background">
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6 outline-none" contentEditable suppressContentEditableWarning>
                  {task.title || 'Untitled Task'}
                </h1>
                
                {/* Fake Notion Editor */}
                <div className="text-text-dim font-light leading-relaxed space-y-4 outline-none" contentEditable suppressContentEditableWarning>
                  <p>Start typing here or press '/' for commands...</p>
                  <p className="opacity-50 text-sm">We will integrate a rich text editor like Tiptap here for full Notion parity.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Slack-style Chat */}
            <div className="w-80 lg:w-96 flex-shrink-0 flex flex-col bg-surface">
              {/* Chat Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                <MessageSquare size={16} className="text-text-dim" />
                <span className="text-sm font-semibold text-white">Discussion</span>
                <span className="ml-auto text-xs text-text-dim">3 participants</span>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
                
                {/* Message 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-white">Alex Chen</span>
                      <span className="text-[10px] text-text-dim">10:42 AM</span>
                    </div>
                    <p className="text-sm text-text-dim mt-0.5 leading-relaxed">
                      I've reviewed the initial designs. Looks solid, but we might need to adjust the padding on mobile.
                    </p>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex-shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-white">Sarah Jenkins</span>
                      <span className="text-[10px] text-text-dim">11:15 AM</span>
                    </div>
                    <p className="text-sm text-text-dim mt-0.5 leading-relaxed">
                      Agreed. I'll push an update to the branch this afternoon.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <div className="px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1 text-xs text-text-dim">
                        👍 1
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chat Input */}
              <div className="p-4 bg-background/50 border-t border-white/5">
                <div className="relative flex items-end bg-surface border border-white/10 rounded-xl focus-within:border-[#F5B800]/50 transition-colors">
                  <textarea 
                    placeholder="Reply to task..." 
                    className="w-full bg-transparent border-none outline-none text-sm text-white resize-none max-h-32 min-h-[44px] py-3 px-4 custom-scrollbar"
                    rows={1}
                  />
                  <div className="flex items-center gap-1 p-2">
                    <button className="p-1.5 text-text-dim hover:text-white transition-colors rounded">
                      <Paperclip size={16} />
                    </button>
                    <button className="p-1.5 text-text-dim hover:text-white transition-colors rounded">
                      <Smile size={16} />
                    </button>
                    <button className="p-1.5 bg-[#F5B800] text-black rounded-lg hover:bg-[#F5B800]/90 transition-colors ml-1 shadow-[0_0_10px_rgba(245,184,0,0.2)]">
                      <Send size={16} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
