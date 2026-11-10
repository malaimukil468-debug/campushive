import React, { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { AndroidCodeStudio } from './components/AndroidCodeStudio';
import { Smartphone, Code2, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'split' | 'device' | 'code'>('device');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/30">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                College Event Management App
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 size={11} /> Android Studio (Java + XML + SQLite)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Android Mobile Simulator &amp; Complete Source Code Studio
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'split' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Split Workspace</span>
          </button>
          <button
            onClick={() => setViewMode('device')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'device' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            <span>Mobile Device</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 size={13} />
            <span>Android Code</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 p-2 sm:p-4 overflow-hidden flex flex-col lg:flex-row gap-4">
        {/* Device Emulator Frame */}
        {(viewMode === 'split' || viewMode === 'device') && (
          <div className={`${viewMode === 'split' ? 'lg:w-[420px] shrink-0' : 'w-full'} flex items-center justify-center`}>
            <MobileFrame onOpenCodeStudio={() => setViewMode('code')} />
          </div>
        )}

        {/* Android Code Studio Panel */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className="flex-1 min-h-[500px] flex flex-col">
            <AndroidCodeStudio />
          </div>
        )}
      </main>
    </div>
  );
}
