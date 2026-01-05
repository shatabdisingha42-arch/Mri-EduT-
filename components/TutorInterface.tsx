
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
    <div className="w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between shrink-0 border-b border-slate-900">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-xl border border-white/20">
            📚
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight tracking-tight">Mri-EduT</h2>
            <div className="flex gap-2 mt-0.5">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-700 text-slate-300 rounded border border-slate-600">Class {profile.grade}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-700 text-slate-300 rounded border border-slate-600">{profile.subject}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          title="Change Subject"
        >
          <span>Change Room</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9m-9-9a9 9 0 019-9" />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-slate-50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-white border border-slate-200 text-slate-300 rounded-lg flex items-center justify-center text-3xl">
              📝
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-800">Welcome, Student {profile.name}</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
                I am your dedicated academic assistant for {profile.subject}. How may I help you with your studies today?
              </p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isTyping && messages[messages.length-1]?.role === 'user' && (
          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg w-fit shadow-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder={`Enter your question regarding ${profile.subject}...`}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 flex items-center justify-center bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg shadow transition-all shrink-0 font-bold text-sm uppercase tracking-widest"
          >
            Submit
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 mt-4 text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em]">
          <span>Mri-EduT AI System</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span>Class {profile.grade} Support</span>
        </div>
      </footer>
    </div>
  );
};

export default TutorInterface;
