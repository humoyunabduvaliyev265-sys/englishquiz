import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CEFRLevel,
  InterfaceLanguage,
  QuizQuestion,
  QuizResult,
  ThemeMode,
  TopicLesson,
  UserProfile,
  VocabWord,
  WordStatus,
} from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/skillsPractice';
import { sound } from '../services/sound';

export type AppView =
  | 'home'
  | 'register'
  | 'level-select'
  | 'dashboard'
  | 'lessons'
  | 'lesson-detail'
  | 'quiz-config'
  | 'quiz-active'
  | 'quiz-results'
  | 'quiz-review'
  | 'ai-teacher'
  | 'vocabulary'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'achievements'
  | 'statistics'
  | 'settings'
  | 'admin';

interface AppContextType {
  user: UserProfile | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeLesson: TopicLesson | null;
  setActiveLesson: (lesson: TopicLesson | null) => void;
  activeQuizResult: QuizResult | null;
  setActiveQuizResult: (res: QuizResult | null) => void;
  selectedTopicForQuiz: string | null;
  setSelectedTopicForQuiz: (topicId: string | null) => void;
  registerUser: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    language: InterfaceLanguage,
    isGuest?: boolean
  ) => void;
  loginUser: (email: string) => boolean;
  logoutUser: () => void;
  selectLevel: (level: CEFRLevel) => void;
  completeLesson: (lessonId: string) => void;
  recordQuizResult: (res: QuizResult) => void;
  updateWordStatus: (wordId: string, status: WordStatus) => void;
  updateSettings: (newSettings: Partial<UserProfile>) => void;
  customQuestions: QuizQuestion[];
  addCustomQuestion: (q: QuizQuestion) => void;
  customWords: VocabWord[];
  addCustomWord: (w: VocabWord) => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
}

const STORAGE_KEY = 'english_quiz_user_profile_v2';
const CUSTOM_Q_KEY = 'english_quiz_custom_questions_v2';
const CUSTOM_W_KEY = 'english_quiz_custom_words_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (user) return 'dashboard';
    return 'home';
  });

  const [activeLesson, setActiveLesson] = useState<TopicLesson | null>(null);
  const [activeQuizResult, setActiveQuizResult] = useState<QuizResult | null>(null);
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const q = localStorage.getItem(CUSTOM_Q_KEY);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  });

  const [customWords, setCustomWords] = useState<VocabWord[]>(() => {
    try {
      const w = localStorage.getItem(CUSTOM_W_KEY);
      return w ? JSON.parse(w) : [];
    } catch {
      return [];
    }
  });

  // Apply theme class to documentElement
  useEffect(() => {
    const theme = user?.theme || 'light';
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [user?.theme]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const registerUser = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    language: InterfaceLanguage,
    isGuest: boolean = false
  ) => {
    // Generate avatar color
    const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      firstName: firstName.trim() || 'Humoyun',
      lastName: lastName.trim() || 'Learner',
      email: email.trim() || (isGuest ? undefined : 'student@englishquiz.uz'),
      isGuest,
      avatarColor,
      level: 'A1',
      language: language || 'en',
      theme: 'light',
      xp: 100, // Welcome bonus
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      quizHistory: [],
      wordStatuses: {},
      soundEnabled: true,
      timerEnabled: true,
      dailyGoalXp: 50,
      todayXp: 100,
      createdAt: new Date().toISOString(),
      role: 'student',
    };

    setUser(newUser);
    // After registration, display the level selection screen
    setCurrentView('level-select');
    sound.playCorrect();
    showNotification(`Hello, ${newUser.firstName}! Welcome to ENGLISH QUIZ.`, 'success');
  };

  const loginUser = (emailInput: string): boolean => {
    // For demo/browser mode
    if (user && (user.email === emailInput || !emailInput)) {
      setCurrentView('dashboard');
      sound.playCorrect();
      showNotification(`Welcome back, ${user.firstName}!`, 'success');
      return true;
    }
    // Auto-create demo profile if none exists
    const demoUser: UserProfile = {
      id: 'usr_demo',
      firstName: 'Humoyun',
      lastName: 'Abduvaliyev',
      email: emailInput || 'humoyun@example.com',
      isGuest: false,
      avatarColor: '#2563eb',
      level: 'A1',
      language: 'en',
      theme: 'light',
      xp: 250,
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: ['a1-to-be'],
      quizHistory: [],
      wordStatuses: { 'v-greet-1': 'mastered', 'v-fam-1': 'learning' },
      soundEnabled: true,
      timerEnabled: true,
      dailyGoalXp: 50,
      todayXp: 50,
      createdAt: new Date().toISOString(),
      role: 'student',
    };
    setUser(demoUser);
    setCurrentView('dashboard');
    sound.playCorrect();
    showNotification(`Welcome back, ${demoUser.firstName}!`, 'success');
    return true;
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentView('home');
    sound.playClick();
    showNotification('You have logged out.', 'info');
  };

  const selectLevel = (level: CEFRLevel) => {
    if (!user) return;
    setUser({ ...user, level });
    setCurrentView('dashboard');
    sound.playCorrect();
    showNotification(`Level set to ${level}! Let's start learning.`, 'success');
  };

  const completeLesson = (lessonId: string) => {
    if (!user) return;
    if (user.completedLessons.includes(lessonId)) {
      showNotification('Lesson already marked completed!', 'info');
      return;
    }
    const bonusXp = 50;
    const updatedLessons = [...user.completedLessons, lessonId];
    setUser({
      ...user,
      xp: user.xp + bonusXp,
      todayXp: user.todayXp + bonusXp,
      completedLessons: updatedLessons,
    });
    sound.playFanfare();
    showNotification(`Lesson completed! +${bonusXp} XP earned! 🎉`, 'success');
  };

  const recordQuizResult = (res: QuizResult) => {
    if (!user) return;
    const updatedHistory = [res, ...user.quizHistory];
    const newXp = user.xp + res.xpEarned;
    const newTodayXp = user.todayXp + res.xpEarned;

    setUser({
      ...user,
      xp: newXp,
      todayXp: newTodayXp,
      quizHistory: updatedHistory,
    });
    setActiveQuizResult(res);
  };

  const updateWordStatus = (wordId: string, status: WordStatus) => {
    if (!user) return;
    const currentStatus = user.wordStatuses[wordId];
    const isNewMastery = status === 'mastered' && currentStatus !== 'mastered';
    const xpBonus = isNewMastery ? 15 : 5;

    setUser({
      ...user,
      xp: user.xp + xpBonus,
      todayXp: user.todayXp + xpBonus,
      wordStatuses: {
        ...user.wordStatuses,
        [wordId]: status,
      },
    });
    sound.playClick();
  };

  const updateSettings = (newSettings: Partial<UserProfile>) => {
    if (!user) return;
    setUser({
      ...user,
      ...newSettings,
    });
    sound.playClick();
  };

  const addCustomQuestion = (q: QuizQuestion) => {
    const updated = [q, ...customQuestions];
    setCustomQuestions(updated);
    localStorage.setItem(CUSTOM_Q_KEY, JSON.stringify(updated));
    showNotification('New quiz question published successfully!', 'success');
  };

  const addCustomWord = (w: VocabWord) => {
    const updated = [w, ...customWords];
    setCustomWords(updated);
    localStorage.setItem(CUSTOM_W_KEY, JSON.stringify(updated));
    showNotification('New vocabulary word added successfully!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        setCurrentView,
        activeLesson,
        setActiveLesson,
        activeQuizResult,
        setActiveQuizResult,
        selectedTopicForQuiz,
        setSelectedTopicForQuiz,
        registerUser,
        loginUser,
        logoutUser,
        selectLevel,
        completeLesson,
        recordQuizResult,
        updateWordStatus,
        updateSettings,
        customQuestions,
        addCustomQuestion,
        customWords,
        addCustomWord,
        showNotification,
        notification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
