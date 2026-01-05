import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../types';
import ChatMessage from './ChatMessage';

interface TutorInterfaceProps {
  profile: UserProfile;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onReset: () => void;
  isTyping: boolean;
}

const TutorInterface: React.FC<TutorInterfaceProps> = ({ 
  profile, 
  messages, 
  onSendMessage, 
  onReset,
  isTyping 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-[1600px] h-[95vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mx-auto">
      {/* Enhanced Header */}
      <header className="px-10 py-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-black">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            🏛️
          </div>
          <div>
            <h2 className="font-serif font-black text-2xl leading-tight tracking-tight">
              Mri-EduT <span className="text-slate-400 font-sans font-medium text-sm ml-3 tracking-widest uppercase">K-12 Expert Tutor</span>
            </h2>
            <div className="flex gap-4 mt-2">
              <span className="text-xs uppercase font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">Class {profile.grade}</span>
              <span className="text-xs uppercase font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">{profile.subject}</span>
              <span className="text-xs uppercase font-bold px-3 py-1 bg-green-900/30 text-green-400 rounded-md border border-green-800/50">Session Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all px-5 py-2.5 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-white/10"
        >
          <span>New Subject</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>
      </header>

      {/* Spacious Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth bg-slate-50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="w-24 h-24 bg-white border border-slate-200 text-slate-300 rounded-3xl flex items-center justify-center text-5xl shadow-sm mb-8">
              📖
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-800 mb-4 tracking-tight">Academic Workspace Initialized</h3>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Hello <span className="text-slate-900 font-bold">{profile.name}</span>! I am your AI assistant for {profile.subject}. 
              Ask me anything about your syllabus, and I'll explain it clearly with steps and formulas.
            </p>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto w-full space-y-12">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm ml-14">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tutor is preparing response...</span>
            </div>
          )}
        </div>
      </div>

      {/* Large Wide Input Area */}
      <footer className="p-10 bg-white border-t border-slate-200 shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="flex gap-6 max-w-[1400px] mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={`Ask your ${profile.subject} question here...`}
              className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-slate-900 focus:ring-8 focus:ring-slate-900/5 outline-none transition-all text-slate-800 placeholder:text-slate-400 text-xl font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              Class {profile.grade} Context
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-14 flex items-center justify-center bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl shadow-xl transition-all shrink-0 font-bold text-lg uppercase tracking-[0.2em] active:scale-95 disabled:shadow-none"
          >
            Submit Query
          </button>
        </form>
        <div className="mt-8 flex justify-between items-center max-w-[1400px] mx-auto px-2">
          <div className="flex items-center gap-3 text-[10px] text-slate-400 uppercase font-black tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            AI Powered Intelligence
          </div>
          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            Academic Integrity Enabled
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TutorInterface;