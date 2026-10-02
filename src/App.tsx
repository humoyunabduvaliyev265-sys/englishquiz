import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { WelcomeHero } from './components/WelcomeHero';
import { AuthModal } from './components/AuthModal';
import { LevelSelector } from './components/LevelSelector';
import { Dashboard } from './components/Dashboard';
import { LessonsView } from './components/LessonsView';
import { QuizEngine } from './components/QuizEngine';
import { AITeacherView } from './components/AITeacherView';
import { VocabularyBuilder } from './components/VocabularyBuilder';
import { SkillsPracticeView } from './components/SkillsPracticeView';
import { AchievementsView } from './components/AchievementsView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsView } from './components/SettingsView';
import { AdminPanelView } from './components/AdminPanelView';
import { GraduationCap, Heart, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, notification } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Global Top Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/20'
                : notification.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-700 shadow-amber-500/20'
                : 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar />

      {/* Active View Router */}
      <main className="flex-1">
        {currentView === 'home' && <WelcomeHero />}
        {currentView === 'register' && <AuthModal />}
        {currentView === 'level-select' && <LevelSelector />}
        {currentView === 'dashboard' && <Dashboard />}
        {(currentView === 'lessons' || currentView === 'lesson-detail') && <LessonsView />}
        {(currentView === 'quiz-config' ||
          currentView === 'quiz-active' ||
          currentView === 'quiz-results' ||
          currentView === 'quiz-review') && <QuizEngine />}
        {currentView === 'ai-teacher' && <AITeacherView />}
        {currentView === 'vocabulary' && <VocabularyBuilder />}
        {currentView === 'reading' && <SkillsPracticeView mode="reading" />}
        {currentView === 'listening' && <SkillsPracticeView mode="listening" />}
        {currentView === 'speaking' && <SkillsPracticeView mode="speaking" />}
        {currentView === 'writing' && <SkillsPracticeView mode="writing" />}
        {currentView === 'achievements' && <AchievementsView />}
        {currentView === 'statistics' && <StatisticsView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'admin' && <AdminPanelView />}
      </main>

      {/* Professional Educational Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              ENGLISH QUIZ
            </span>
            <span>— Learn English. Test Your Skills. Reach Your Goals.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span>CEFR A1 • A2 • B1 • B2 • C1 • C2</span>
            <span>•</span>
            <span>Gemini AI Tutor</span>
            <span>•</span>
            <span>Multi-Language (EN/UZ/RU)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
