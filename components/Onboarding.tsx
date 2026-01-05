
import React, { useState } from 'react';
import { GradeLevel, Subject, UserProfile } from '../types';

interface OnboardingProps {
  onStart: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(1);
  const [subject, setSubject] = useState<Subject>(Subject.MATH);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ name, grade, subject });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 bg-blue-600 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome to Mri-EduT</h1>
        <p className="text-blue-100 mt-2">Personalized learning for every student</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">What's your name?</label>
          <input
            type="text"
            required
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Grade (Class)</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
            >
              {Object.values(Subject).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Start Learning
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
