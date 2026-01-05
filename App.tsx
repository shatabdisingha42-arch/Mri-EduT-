
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from './types';
import { GeminiTutorService } from './services/geminiService';
import Onboarding from './components/Onboarding';
import TutorInterface from './components/TutorInterface';

const STORAGE_KEY_PROFILE = 'mri-edut-profile-v1';
const STORAGE_KEY_MESSAGES = 'mri-edut-messages-v1';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const tutorService = useRef<GeminiTutorService | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
    const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync profile to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    if (profile) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
    }
  }, [profile, isInitialized]);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } else if (profile === null) {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    }
  }, [messages, profile, isInitialized]);

  // Initialize Gemini Service when profile is available
  useEffect(() => {
    if (profile && !tutorService.current) {
      tutorService.current = new GeminiTutorService();
      tutorService.current.initChat(profile);
    }
  }, [profile]);

  const handleStart = (userProfile: UserProfile) => {
    setProfile(userProfile);
    setMessages([]); // Reset messages for a fresh onboarding start
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
    if (window.confirm("Are you sure you want to end this session? Your chat history will be cleared.")) {
      setProfile(null);
      setMessages([]);
      tutorService.current = null;
      localStorage.removeItem(STORAGE_KEY_PROFILE);
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    }
  };

  // Display a loading state while checking localStorage to prevent UI flickering
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
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
