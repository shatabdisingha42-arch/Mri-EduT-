
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
    <div className="w-full max-w-[1400px] h-[92vh] flex flex-col bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden">
      {/* Header */}
      <header className="px-8 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-950">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl border border-white/20 shadow-inner">
            📚
          </div>
          <div>
            <h2 className="font-serif font-extrabold text-xl leading-tight tracking-tight">Mri-EduT <span className="text-slate-500 font-sans font-normal text-sm ml-2">Academic Portal</span></h2>
            <div className="flex gap-3 mt-1">
              <span className="text-[11px] uppercase font-bold px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">Class {profile.grade}</span>
              <span className="text-[11px] uppercase font-bold px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">{profile.subject}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-all p-2.5 rounded-lg hover:bg-white/10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-transparent hover:border-white/10"
          title="Change Subject"
        >
          <span>Change Room</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9m-9-9a9 9 0 019-9" />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth bg-slate-50/50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-6">
            <div className="w-20 h-20 bg-white border border-slate-200 text-slate-200 rounded-2xl flex items-center justify-center text-4xl shadow-sm">
              🖋️
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">Welcome, {profile.name}</h3>
              <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
                Your study session for <span className="text-slate-800 font-semibold">{profile.subject}</span> is now active. 
                What concept shall we explore together today?
              </p>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto w-full space-y-8">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {isTyping && messages[messages.length-1]?.role === 'user' && (
            <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tutor Thinking</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <footer className="p-8 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-6xl mx-auto">
          <input
            type="text"
            placeholder={`Type your ${profile.subject} question here...`}
            className="flex-1 px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 outline-none transition-all text-slate-800 placeholder:text-slate-400 text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-10 flex items-center justify-center bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-xl shadow-lg transition-all shrink-0 font-bold text-base uppercase tracking-widest active:scale-95"
          >
            Ask Tutor
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 mt-6 text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em]">
          <span>Advanced K-12 Tutoring Engine</span>
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
          <span>Secure Academic Environment</span>
        </div>
      </footer>
    </div>
  );
};

export default TutorInterface;
