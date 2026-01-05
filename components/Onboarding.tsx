
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
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="p-8 bg-slate-800 text-white text-center border-b border-slate-700">
        <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-white/20">
          <span className="text-3xl text-white">📖</span>
        </div>
        <h1 className="text-2xl font-serif font-bold tracking-tight">Mri-EduT</h1>
        <p className="text-slate-300 text-sm mt-1 uppercase tracking-widest font-medium">Academic Excellence</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Student Name</label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all text-slate-800 placeholder:text-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Grade Level</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white text-slate-800"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Subject</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none bg-white text-slate-800"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
            >
              {Object.values(Subject).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-lg shadow transition-colors"
          >
            Enter Study Room
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase font-medium">
            Personalized Academic Assistance
          </p>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
