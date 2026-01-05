
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
    <div className="w-full max-w-4xl h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">Mri-EduT</h2>
            <div className="flex gap-2 mt-0.5">
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">Class {profile.grade}</span>
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full">{profile.subject}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Switch Class/Subject"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9m-9-9a9 9 0 019-9" />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center text-4xl animate-pulse">
              👋
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Hi {profile.name}!</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                I'm your {profile.subject} tutor for Class {profile.grade}. What would you like to learn today?
              </p>
            </div>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isTyping && messages[messages.length-1]?.role === 'user' && (
          <div className="flex items-center gap-2 p-4 bg-white rounded-2xl w-fit shadow-sm border border-slate-100">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder={`Ask me anything about ${profile.subject}...`}
            className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl shadow-lg hover:shadow-blue-200 transition-all shrink-0"
          >
            <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-wider font-semibold">
          Tailored tutoring powered by Gemini
        </p>
      </footer>
    </div>
  );
};

export default TutorInterface;
