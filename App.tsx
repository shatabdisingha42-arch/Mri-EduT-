
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, GradeLevel, Subject, Message } from './types';
import { GeminiTutorService } from './services/geminiService';
import Onboarding from './components/Onboarding';
import TutorInterface from './components/TutorInterface';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const tutorService = useRef<GeminiTutorService | null>(null);

  useEffect(() => {
    if (profile && !tutorService.current) {
      tutorService.current = new GeminiTutorService();
      tutorService.current.initChat(profile);
    }
  }, [profile]);

  const handleStart = (userProfile: UserProfile) => {
    setProfile(userProfile);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !tutorService.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, modelMsg]);

    try {
      let fullContent = '';
      await tutorService.current.sendMessageStream(text, (chunk) => {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(m => m.id === modelMsgId ? { ...m, content: fullContent } : m)
        );
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => 
        prev.map(m => m.id === modelMsgId ? { ...m, content: "Oops! I ran into an error. Please try again." } : m)
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setMessages([]);
    tutorService.current = null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!profile ? (
        <Onboarding onStart={handleStart} />
      ) : (
        <TutorInterface 
          profile={profile} 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          onReset={handleReset}
          isTyping={isTyping}
        />
      )}
    </div>
  );
};

export default App;
