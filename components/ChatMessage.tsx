
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple LaTeX rendering using standard window.renderMathInElement if available via KaTeX CDN
    // Since we're in a single file React context, we'll use a safer approach:
    // We'll rely on the global 'katex' loaded in index.html
    const renderMath = () => {
      if (window.katex && containerRef.current) {
        const text = message.content;
        
        // Match $...$ and $$...$$
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
          
          // Basic Markdown support (bold, bullet points)
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
        }`}>
          {isUser ? '👤' : '🤖'}
        </div>
        
        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
        }`}>
          <div ref={containerRef} className="prose prose-sm max-w-none prose-slate">
            {/* Rendered by useEffect */}
            {!window.katex && message.content}
          </div>
          <div className={`text-[10px] mt-2 opacity-50 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for KaTeX
declare global {
  interface Window {
    katex: any;
  }
}

export default ChatMessage;
