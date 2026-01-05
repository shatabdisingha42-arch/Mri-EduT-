
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderContent = () => {
      if (!containerRef.current) return;
      
      let text = message.content;
      
      // If KaTeX is available, we split by math delimiters
      if (window.katex) {
        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
        
        containerRef.current.innerHTML = parts.map(part => {
          // Block Math $$...$$
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const math = part.slice(2, -2);
            try {
              return window.katex.renderToString(math, { displayMode: true, throwOnError: false });
            } catch (e) { return part; }
          } 
          // Inline Math $...$
          else if (part.startsWith('$') && part.endsWith('$')) {
            const math = part.slice(1, -1);
            try {
              return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch (e) { return part; }
          }
          
          // Process basic markdown for non-math parts
          return processMarkdown(part);
        }).join('');
      } else {
        containerRef.current.innerHTML = processMarkdown(text);
      }
    };

    const processMarkdown = (t: string) => {
      return t
        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-extrabold">$1</strong>')
        // Italic: *text* (only if not bold)
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>')
        // Newlines to <br/>
        .replace(/\n/g, '<br/>')
        // Lists: lines starting with "- " or "* "
        .replace(/^\s*[-*]\s+(.*)/gm, '<div class="flex gap-2 mb-1"><span class="text-slate-400">•</span><span>$1</span></div>')
        // Headings: ### Heading
        .replace(/^### (.*)/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-slate-800">$1</h3>')
        .replace(/^## (.*)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-slate-900 border-b border-slate-100 pb-1">$1</h2>');
    };

    renderContent();
  }, [message.content]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      <div className={`flex gap-4 w-full ${isUser ? 'flex-row-reverse max-w-[80%]' : 'flex-row max-w-[95%]'}`}>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm text-base font-bold transition-all ${
          isUser 
            ? 'bg-white border-slate-200 text-slate-500 hover:border-slate-400' 
            : 'bg-slate-900 border-slate-950 text-white'
        }`}>
          {isUser ? 'S' : 'T'}
        </div>
        
        <div className={`flex-1 p-6 rounded-2xl shadow-sm text-base leading-relaxed transition-all ${
          isUser 
            ? 'bg-white text-slate-700 border border-slate-200 border-r-4 border-r-slate-400' 
            : 'bg-white text-slate-800 border border-slate-200 border-l-[6px] border-l-slate-900'
        }`}>
          <div ref={containerRef} className="prose-slate max-w-none font-medium text-slate-700 space-y-1">
            {/* Rendered by useEffect */}
            {message.content === '' && <span className="text-slate-300 italic">Thinking...</span>}
          </div>
          <div className={`text-[10px] mt-4 opacity-40 font-bold uppercase tracking-wider ${isUser ? 'text-right' : 'text-left'}`}>
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
