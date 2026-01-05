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
      
      // If text is empty (thinking state)
      if (!text) return;

      // Handle common AI quirk: escaped markers
      text = text.replace(/\\\*/g, '*').replace(/\\_/g, '_');

      // More robust math detection: supports $$, $, \[, \(
      const mathRegex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\(.+?\\\))/g;
      
      if (window.katex) {
        const parts = text.split(mathRegex);
        
        containerRef.current.innerHTML = parts.map(part => {
          // Block Math $$...$$ or \[...\]
          if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('\\\[') && part.endsWith('\\\]'))) {
            const math = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
            try {
              return window.katex.renderToString(math, { displayMode: true, throwOnError: false });
            } catch (e) { return part; }
          } 
          // Inline Math $...$ or \(...\)
          else if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('\\\(') && part.endsWith('\\\)') )) {
            const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
            try {
              return window.katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch (e) { return part; }
          }
          
          // Process markdown for text parts
          return processMarkdown(part);
        }).join('');
      } else {
        containerRef.current.innerHTML = processMarkdown(text);
      }
    };

    const processMarkdown = (t: string) => {
      return t
        // Bold: **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>')
        // Italic: *text* (avoiding math interference)
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic text-slate-600">$1</em>')
        // Newlines to <br/>
        .replace(/\n/g, '<br/>')
        // Lists: bullet points
        .replace(/^\s*[-*]\s+(.*)/gm, '<div class="flex gap-3 mb-2 ml-2"><span class="text-slate-400 font-bold">•</span><span class="text-slate-700">$1</span></div>')
        // Numbered lists
        .replace(/^\s*\d+\.\s+(.*)/gm, '<div class="flex gap-3 mb-2 ml-2 font-medium"><span class="text-slate-900">$0</span></div>')
        // Headings
        .replace(/^### (.*)/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-slate-800 tracking-tight">$1</h3>')
        .replace(/^## (.*)/gm, '<h2 class="text-2xl font-black mt-8 mb-4 text-slate-900 border-b-2 border-slate-100 pb-2 tracking-tight">$1</h2>');
    };

    renderContent();
  }, [message.content]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className={`flex gap-6 w-full ${isUser ? 'flex-row-reverse max-w-[70%]' : 'flex-row max-w-[95%]'}`}>
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-md text-xl font-black transition-all ${
          isUser 
            ? 'bg-white border-slate-200 text-slate-400' 
            : 'bg-slate-900 border-black text-white shadow-xl rotate-3'
        }`}>
          {isUser ? 'S' : 'MT'}
        </div>
        
        {/* Message Bubble - Made MUCH wider and larger */}
        <div className={`flex-1 p-8 rounded-3xl shadow-sm transition-all border ${
          isUser 
            ? 'bg-white text-slate-700 border-slate-200 rounded-tr-none' 
            : 'bg-white text-slate-800 border-slate-200 rounded-tl-none border-l-[10px] border-l-slate-900'
        }`}>
          <div ref={containerRef} className="prose-slate max-w-none text-lg leading-[1.8] font-medium text-slate-700">
            {message.content === '' && (
              <div className="flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded"></div>
                <div className="h-4 w-1/2 bg-slate-100 animate-pulse rounded"></div>
              </div>
            )}
          </div>
          <div className={`text-[10px] mt-6 opacity-30 font-black uppercase tracking-[0.2em] ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'Student' : 'Mri-EduT System'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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