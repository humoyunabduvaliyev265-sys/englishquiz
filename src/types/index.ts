export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type InterfaceLanguage = 'en' | 'uz' | 'ru';

export type ThemeMode = 'light' | 'dark' | 'system';

export type WordStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  isGuest: boolean;
  avatarColor: string;
  level: CEFRLevel;
  language: InterfaceLanguage;
  theme: ThemeMode;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  quizHistory: QuizResult[];
  wordStatuses: Record<string, WordStatus>;
  soundEnabled: boolean;
  timerEnabled: boolean;
  dailyGoalXp: number;
  todayXp: number;
  lastDailyChallengeDate?: string;
  createdAt: string;
  role: 'student' | 'admin';
}

export interface QuizQuestion {
  id: string;
  level: CEFRLevel;
  topicId: string;
  topicTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  questionUz?: string;
  questionRu?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationUz: string;
  explanationRu?: string;
}

export interface QuizConfig {
  questionCount: 20 | 25 | 30 | 40 | 50;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  level: CEFRLevel;
  topicId?: string; // empty means mixed from level
  timed?: boolean;
}

export interface QuizAnswerRecord {
  questionId: string;
  questionText: string;
  options: string[];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  explanationUz: string;
}

export interface QuizResult {
  id: string;
  date: string;
  level: CEFRLevel;
  topicTitle: string;
  questionCount: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  xpEarned: number;
  answers: QuizAnswerRecord[];
}

export interface LessonRule {
  rule: string;
  ruleUz: string;
  example: string;
  exampleUz: string;
}

export interface LessonExercise {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationUz: string;
}

export interface TopicLesson {
  id: string;
  level: CEFRLevel;
  category: 'grammar' | 'vocabulary' | 'conversation' | 'academic';
  title: string;
  titleUz: string;
  titleRu: string;
  description: string;
  descriptionUz: string;
  estimatedMinutes: number;
  explanation: string;
  explanationUz: string;
  rules: LessonRule[];
  vocabularyCards: {
    word: string;
    phonetic: string;
    uzbek: string;
    example: string;
    exampleUz: string;
  }[];
  exercises: LessonExercise[];
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  uzbek: string;
  russian: string;
  category: string;
  level: CEFRLevel;
  example: string;
  exampleUz: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleUz: string;
  titleRu: string;
  description: string;
  descriptionUz: string;
  descriptionRu: string;
  icon: string;
  current: number;
  max: number;
  unlocked: boolean;
  xpReward: number;
}

export interface ReadingPassage {
  id: string;
  level: CEFRLevel;
  title: string;
  titleUz: string;
  passage: string;
  passageUz: string;
  keyWords: { word: string; translation: string }[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    explanationUz: string;
  }[];
}

export interface ListeningDialogue {
  id: string;
  level: CEFRLevel;
  title: string;
  titleUz: string;
  situation: string;
  dialogueLines: { speaker: string; text: string; textUz: string }[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    explanationUz: string;
  }[];
}

export interface SpeakingPrompt {
  id: string;
  level: CEFRLevel;
  title: string;
  prompt: string;
  targetSentence: string;
  phonetic: string;
  translationUz: string;
  tips: string;
}

export interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  title: string;
  prompt: string;
  promptUz: string;
  guidingQuestions: string[];
  sampleAnswer: string;
  minWords: number;
}
