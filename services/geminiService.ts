
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile, Subject } from "../types";

export class GeminiTutorService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  private getSystemInstruction(profile: UserProfile): string {
    const { grade, subject } = profile;
    
    let languageGuideline = "";
    if (grade >= 1 && grade <= 5) {
      languageGuideline = "Use very simple words, short sentences, and fun analogies. Focus on foundational concepts. Imagine you are talking to a young child.";
    } else if (grade >= 6 && grade <= 8) {
      languageGuideline = "Use clear, instructional language. Introduce technical terms but always provide easy-to-understand definitions.";
    } else {
      languageGuideline = "Use academic and technical language. Provide in-depth explanations, use LaTeX for formulas, and encourage critical thinking.";
    }

    let subjectGuideline = "";
    switch (subject) {
      case Subject.MATH:
        subjectGuideline = "Show step-by-step solutions. Use LaTeX for math symbols (e.g., $E=mc^2$).";
        break;
      case Subject.SCIENCE:
      case Subject.PHYSICS:
      case Subject.CHEMISTRY:
      case Subject.BIOLOGY:
        subjectGuideline = "Explain the 'why' behind phenomena and use real-world examples to illustrate complex concepts.";
        break;
      case Subject.ENGLISH_LIT:
        subjectGuideline = "Analyze themes, characters, and historical context. Focus on narrative structure and literary devices.";
        break;
      case Subject.ENGLISH_LANG:
      case Subject.HINDI:
        subjectGuideline = `Focus on grammar, vocabulary, sentence structure, and linguistic rules. ${subject === Subject.HINDI ? 'Use Devanagari script for Hindi examples and focus on both language usage and classic literature excerpts suitable for the grade.' : 'Focus on effective communication, syntax, and comprehension.'}`;
        break;
      case Subject.GK:
        subjectGuideline = "Provide broad facts and interesting trivia about the world, current events (if relevant), history, and geography. Keep information concise and engaging.";
        break;
      default:
        subjectGuideline = "Provide structured, fact-based explanations with clear headings.";
    }

    return `
      You are an expert K-12 AI Tutor named "Mri-EduT".
      Your student is in Class ${grade} and is studying ${subject}.
      
      RULES:
      1. Always check Class ${grade} and Subject ${subject} context.
      2. LANGUAGE: ${languageGuideline}
      3. SUBJECT SPECIFICITY: ${subjectGuideline}
      4. CONSTRAINTS: 
         - Never give the full answer immediately for homework/test questions; guide with hints first.
         - If asked for the full solution directly, provide it after one hint or if requested.
         - Redirect dangerous or inappropriate topics to their studies politely.
      
      OUTPUT FORMAT:
      - Start with: "Hello! As a Class ${grade} student, here is how you can understand this..."
      - Use **bolding** for key terms.
      - Use bullet points for steps or lists.
      - Use LaTeX (wrapped in $ or $$) for all mathematical formulas.
    `.trim();
  }

  public initChat(profile: UserProfile) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: this.getSystemInstruction(profile),
        temperature: 0.7,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) throw new Error("Chat not initialized");
    const response: GenerateContentResponse = await this.chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  }

  public async sendMessageStream(message: string, onChunk: (chunk: string) => void): Promise<void> {
    if (!this.chat) throw new Error("Chat not initialized");
    const stream = await this.chat.sendMessageStream({ message });
    for await (const chunk of stream) {
      const c = chunk as GenerateContentResponse;
      onChunk(c.text || "");
    }
  }
}
