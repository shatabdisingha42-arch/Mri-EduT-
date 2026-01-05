
export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export enum Subject {
  MATH = "Mathematics",
  SCIENCE = "Science",
  ENGLISH_LANG = "English Language",
  ENGLISH_LIT = "English Literature",
  HINDI = "Hindi Language & Literature",
  GK = "General Knowledge",
  HISTORY = "History",
  GEOGRAPHY = "Geography",
  COMPUTER_SCIENCE = "Computer Science",
  PHYSICS = "Physics",
  CHEMISTRY = "Chemistry",
  BIOLOGY = "Biology"
}

export interface UserProfile {
  name: string;
  grade: GradeLevel;
  subject: Subject;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
