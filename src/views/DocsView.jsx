import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Search, Star, Clock, MoreHorizontal, FileText, Pin, Trash2, X } from 'lucide-react';

const SAMPLE_DOCS = [];

export default function DocsView() {
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docs, setDocs] = useState(SAMPLE_DOCS);

  const filtered = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.tag.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setDocs(prev => prev.map(d => d.id === id ? { ...d, starred: !d.starred } : d));
  };

  const deleteDoc = (id, e) => {
    e.stopPropagation();
    setDocs(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col bg-white/[0.02]">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white font-bold text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-[#F5B800]" /> Docs
            </h1>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:text-white hover:bg-white/10 transition-all">
              <Plus size={16} />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              placeholder="Search docs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-text-dim focus:outline-none focus:border-[#F5B800]/50 transition-colors"
            />
          </div>
        </div>

        {/* Pinned Section */}
        {filtered.some(d => d.pinned) && (
          <div className="px-3 pt-4 pb-1">
            <p className="text-text-dim/60 text-[10px] font-semibold uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
              <Pin size={10} /> Pinned
            </p>
            {filtered.filter(d => d.pinned).map(doc => (
              <DocRow key={doc.id} doc={doc} selectedDoc={selectedDoc} onClick={() => setSelectedDoc(doc)} onStar={toggleStar} onDelete={deleteDoc} />
            ))}
          </div>
        )}

        {/* All Docs Section */}
        <div className="px-3 pt-3 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-text-dim/60 text-[10px] font-semibold uppercase tracking-wider px-2 mb-2">All Documents</p>
          {filtered.filter(d => !d.pinned).map(doc => (
            <DocRow key={doc.id} doc={doc} selectedDoc={selectedDoc} onClick={() => setSelectedDoc(doc)} onStar={toggleStar} onDelete={deleteDoc} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <FileText size={28} className="text-text-dim mb-2" />
              <p className="text-text-dim text-xs">No documents found</p>
            </div>
          )}
        </div>

        {/* New Doc Button */}
        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all">
            <Plus size={15} /> New Document
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <AnimatePresence mode="wait">
        {selectedDoc ? (
          <motion.div
            key={selectedDoc.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto custom-scrollbar p-10"
          >
            {/* Doc Header */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                    style={{ background: `${selectedDoc.tagColor}20`, color: selectedDoc.tagColor }}
                  >
                    {selectedDoc.tag}
                  </span>
                  <h1 className="text-4xl font-bold text-white leading-tight mb-3">{selectedDoc.title}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img src={selectedDoc.authorAvatar} alt="" className="w-6 h-6 rounded-full bg-white/10" />
                      <span className="text-text-dim text-sm">{selectedDoc.author}</span>
                    </div>
                    <span className="text-text-dim/50 text-xs flex items-center gap-1">
                      <Clock size={11} /> Updated {selectedDoc.updated}
                    </span>
                    <span className="text-text-dim/50 text-xs">{selectedDoc.words.toLocaleString()} words</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => toggleStar(selectedDoc.id, e)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                      selectedDoc.starred
                        ? 'text-[#F5B800] border-[#F5B800]/30 bg-[#F5B800]/10'
                        : 'text-text-dim border-white/10 hover:text-[#F5B800] hover:border-[#F5B800]/30'
                    }`}
                  >
                    <Star size={15} fill={selectedDoc.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-text-dim hover:text-white transition-all">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-8">
                <p className="text-text-dim leading-relaxed text-base mb-6">{selectedDoc.preview}</p>

                {/* Placeholder Content Blocks */}
                <div className="space-y-6">
                  {['Introduction', 'Key Objectives', 'Timeline & Milestones', 'Resources'].map((section) => (
                    <div key={section} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <h2 className="text-white font-semibold text-lg mb-3">{section}</h2>
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-2.5 bg-white/5 rounded-full" style={{ width: `${60 + (i * section.length % 30)}%` }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center opacity-30"
          >
            <FileText size={56} className="text-text-dim mb-4" />
            <p className="text-white text-lg font-semibold">Select a document</p>
            <p className="text-text-dim text-sm mt-1">Choose a doc from the sidebar to view it here.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocRow({ doc, selectedDoc, onClick, onStar, onDelete }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 flex items-center gap-2 group transition-all ${
        selectedDoc?.id === doc.id
          ? 'bg-[#F5B800]/10 border border-[#F5B800]/20'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <FileText size={14} className={selectedDoc?.id === doc.id ? 'text-[#F5B800]' : 'text-text-dim'} />
      <span className={`flex-1 text-sm truncate font-medium ${selectedDoc?.id === doc.id ? 'text-white' : 'text-text-dim'}`}>
        {doc.title}
      </span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => onStar(doc.id, e)}
          className={`w-5 h-5 flex items-center justify-center rounded ${doc.starred ? 'text-[#F5B800]' : 'text-text-dim hover:text-[#F5B800]'}`}
        >
          <Star size={11} fill={doc.starred ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => onDelete(doc.id, e)}
          className="w-5 h-5 flex items-center justify-center rounded text-text-dim hover:text-red-400"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </button>
  );
}
