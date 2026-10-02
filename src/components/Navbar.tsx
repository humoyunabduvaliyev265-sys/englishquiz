import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { InterfaceLanguage } from '../types';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Compass,
  FileQuestion,
  BookA,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentView, setCurrentView, logoutUser, updateSettings } = useApp();
  const lang = user?.language || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const toggleTheme = () => {
    const nextTheme = user?.theme === 'dark' ? 'light' : 'dark';
    if (user) {
      updateSettings({ theme: nextTheme });
    } else {
      const root = document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleLanguageChange = (newLang: InterfaceLanguage) => {
    if (user) {
      updateSettings({ language: newLang });
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Compass, requiresAuth: true },
    { id: 'lessons', label: t('navLearn'), icon: BookOpen, requiresAuth: true },
    { id: 'ai-teacher', label: t('navAITeacher'), icon: Sparkles, requiresAuth: true },
    { id: 'vocabulary', label: t('navVocabulary'), icon: BookA, requiresAuth: true },
    { id: 'quiz-config', label: t('navQuizzes'), icon: FileQuestion, requiresAuth: true },
    { id: 'statistics', label: t('navStats'), icon: BarChart3, requiresAuth: true },
    { id: 'settings', label: t('navSettings'), icon: Settings, requiresAuth: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView(user ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ENGLISH QUIZ
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Stats, Language, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Stats in Header if logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800">
              {/* Level Badge */}
              <button
                onClick={() => setCurrentView('level-select')}
                title="Change Level"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 hover:scale-105 transition-transform"
              >
                <span>CEFR:</span>
                <span className="underline">{user.level}</span>
              </button>

              {/* Streak */}
              <div
                title={`${user.streak} day learning streak!`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{user.streak}d</span>
              </div>

              {/* XP */}
              <div
                title={`${user.xp} Total Experience Points`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60"
              >
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>{user.xp} XP</span>
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as InterfaceLanguage)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="uz">🇺🇿 UZ</option>
              <option value="ru">🇷🇺 RU</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={user?.theme === 'dark' ? t('lightMode') : t('darkMode')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            {user?.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: user.avatarColor || '#2563eb' }}
                >
                  {user.firstName[0]?.toUpperCase() || 'U'}
                  {user.lastName[0]?.toUpperCase() || ''}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline-block max-w-[80px] truncate">
                  {user.firstName}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email || 'Guest Student'}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        Level: {user.level}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {user.xp} XP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('statistics');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('navProfile')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('level-select');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('chooseLevelHeading')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{t('navAdmin')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('navSettings')}</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                  <button
                    onClick={() => {
                      logoutUser();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('register')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
              >
                {t('loginBtn')}
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/25 transition-all"
              >
                {t('getStarted')}
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {user && (
            <button
              onClick={() => {
                logoutUser();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
