
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMath = () => {
      if (window.katex && containerRef.current) {
        const text = message.content;
        
        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
        
        containerRef.current.innerHTML = parts.map(part => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const math = part.slice(2, -2);
            try {
              return window.katex.renderToString(math, { displayMode: true, throwOnError: false });
            } catch (e) { return part; }
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            try {
              return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch (e) { return part; }
          }
          
          return part
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^\s*-\s+(.*)/gm, '<li>$1</li>')
            .replace(/\n/g, '<br/>');
        }).join('');
      }
    };

    renderMath();
  }, [message.content]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`flex gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 shadow-sm text-sm ${
          isUser ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-900 text-white'
        }`}>
          {isUser ? 'S' : 'T'}
        </div>
        
        <div className={`p-4 rounded-lg shadow-sm text-sm leading-relaxed ${
          isUser 
            ? 'bg-white text-slate-800 border border-slate-300 border-r-4 border-r-slate-400' 
            : 'bg-white text-slate-800 border border-slate-300 border-l-4 border-l-slate-800'
        }`}>
          <div ref={containerRef} className="prose prose-sm max-w-none prose-slate font-medium text-slate-700">
            {/* Rendered by useEffect */}
            {!window.katex && message.content}
          </div>
          <div className={`text-[9px] mt-2 opacity-40 font-bold uppercase tracking-tighter ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    katex: any;
  }
}

export default ChatMessage;
