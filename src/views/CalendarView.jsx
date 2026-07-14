import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENT_COLORS = ['#F5B800','#a855f7','#22d3ee','#34d399','#f87171','#fb923c'];

const INITIAL_EVENTS = [
  { id: 1, date: '', title: 'Team Sprint Planning', time: '09:00', color: '#F5B800' },
  { id: 2, date: '', title: 'Product Demo', time: '14:00', color: '#a855f7' },
  { id: 3, date: '', title: 'Client Meeting', time: '11:00', color: '#22d3ee' },
  { id: 4, date: '', title: '1:1 with Alice', time: '15:00', color: '#34d399' },
  { id: 5, date: '', title: 'Design Review', time: '10:00', color: '#fb923c' },
];

function padZ(n) { return String(n).padStart(2, '0'); }
function toDateStr(y, m, d) { return `${y}-${padZ(m + 1)}-${padZ(d)}`; }

// Scatter events across the current month for demo
function initEvents() {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const days = [5, 12, 14, now.getDate(), now.getDate() + 2];
  return INITIAL_EVENTS.map((ev, i) => ({
    ...ev,
    date: toDateStr(y, m, Math.min(days[i], 28)),
  }));
}

export default function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()));
  const [events, setEvents] = useState(initEvents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const selectedEvents = events.filter(e => e.date === selectedDate);

  const addEvent = () => {
    if (!newTitle.trim()) return;
    const colorIdx = events.length % EVENT_COLORS.length;
    setEvents(prev => [...prev, {
      id: Date.now(), date: selectedDate,
      title: newTitle.trim(), time: newTime,
      color: EVENT_COLORS[colorIdx],
    }]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  return (
    <div className="p-8 h-full flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 flex-shrink-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Calendar</h1>
          <p className="text-text-dim text-sm">Plan your time, stay on top of your schedule.</p>
        </div>
        <button
          onClick={() => { setSelectedDate(todayStr); setShowAddForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#F5B800] text-black font-bold text-sm rounded-xl hover:bg-[#F5B800]/90 transition-all shadow-[0_0_20px_rgba(245,184,0,0.2)]"
        >
          <Plus size={16} /> Add Event
        </button>
      </motion.div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">
              {MONTH_NAMES[month]} <span className="text-text-dim font-normal">{year}</span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-text-dim hover:text-white transition-all border border-white/10"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                className="px-3 h-9 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-text-dim hover:text-white transition-all border border-white/10"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-text-dim hover:text-white transition-all border border-white/10"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-text-dim/60 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {/* Blank cells */}
            {Array.from({ length: firstWeekday }, (_, i) => (
              <div key={`b-${i}`} />
            ))}

            {/* Day Cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(year, month, day);
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  whileHover={{ scale: 1.03 }}
                  className={`relative flex flex-col p-2 rounded-xl min-h-[72px] text-left border transition-all ${
                    isSelected
                      ? 'bg-[#F5B800]/10 border-[#F5B800]/40'
                      : isToday
                      ? 'bg-white/[0.06] border-white/20'
                      : 'bg-transparent border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                  }`}
                >
                  {/* Day Number */}
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? 'bg-[#F5B800] text-black'
                        : isSelected
                        ? 'text-[#F5B800]'
                        : 'text-white/70'
                    }`}
                  >
                    {day}
                  </span>

                  {/* Event Chips */}
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map(ev => (
                      <span
                        key={ev.id}
                        className="block text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate leading-tight"
                        style={{ background: `${ev.color}30`, color: ev.color }}
                      >
                        {ev.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-text-dim px-1">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-72 flex-shrink-0 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-white font-semibold text-sm">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-text-dim text-xs mt-0.5">
              {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Events */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <AnimatePresence>
              {selectedEvents.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 opacity-30"
                >
                  <Clock size={32} className="text-text-dim mb-3" />
                  <p className="text-white text-sm font-medium">No events</p>
                  <p className="text-text-dim text-xs mt-1">Click + Add Event to schedule</p>
                </motion.div>
              ) : (
                selectedEvents
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(ev => (
                    <motion.div
                      key={ev.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group flex items-start gap-3 p-3 mb-2 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                    >
                      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: ev.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{ev.title}</p>
                        <p className="text-text-dim text-xs mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {ev.time}
                        </p>
                      </div>
                      <button
                        onClick={() => removeEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-red-400 p-0.5 rounded"
                      >
                        <X size={13} />
                      </button>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>

            {/* Add Event Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-3 rounded-xl border border-[#F5B800]/30 bg-[#F5B800]/5"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Event title…"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addEvent(); if (e.key === 'Escape') setShowAddForm(false); }}
                    className="w-full bg-transparent text-white text-sm placeholder:text-text-dim focus:outline-none mb-2"
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full bg-transparent text-text-dim text-xs focus:outline-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addEvent}
                      className="flex-1 py-1.5 bg-[#F5B800] text-black text-xs font-bold rounded-lg"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-1.5 bg-white/10 text-text-dim text-xs font-medium rounded-lg hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Event Button */}
          {!showAddForm && (
            <div className="p-4 border-t border-white/5">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/20 rounded-xl text-text-dim hover:text-white hover:border-white/40 text-sm transition-all"
              >
                <Plus size={14} /> Add Event
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
