import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FileQuestion,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Zap,
  Award,
  Globe,
  Star,
} from 'lucide-react';

export const WelcomeHero: React.FC = () => {
  const { setCurrentView, user } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const benefits = [
    {
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      title: t('benefitsGrammar'),
      desc: t('benefitsGrammarDesc'),
    },
    {
      icon: FileQuestion,
      color: 'from-purple-500 to-pink-500',
      title: t('benefitsQuizzes'),
      desc: t('benefitsQuizzesDesc'),
    },
    {
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      title: t('benefitsAI'),
      desc: t('benefitsAIDesc'),
    },
    {
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      title: t('benefitsVocab'),
      desc: t('benefitsVocabDesc'),
    },
    {
      icon: Headphones,
      color: 'from-cyan-500 to-blue-500',
      title: 'Listening & Dialogues',
      desc: 'Real conversations with native pronunciation and adjustable playback speeds.',
    },
    {
      icon: Mic,
      color: 'from-rose-500 to-red-500',
      title: 'Speaking & Pronunciation',
      desc: 'Practice speaking with browser voice recognition and immediate confidence feedback.',
    },
  ];

  const levelsPreview = [
    { level: 'A1', name: 'Beginner', color: 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' },
    { level: 'A2', name: 'Elementary', color: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' },
    { level: 'B1', name: 'Intermediate', color: 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300' },
    { level: 'B2', name: 'Upper Intermediate', color: 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300' },
    { level: 'C1', name: 'Advanced', color: 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300' },
    { level: 'C2', name: 'Proficient', color: 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300' },
  ];

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-blue-100/40 via-purple-50/20 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent pointer-events-none -z-10 rounded-b-full blur-3xl"></div>

      {/* Hero Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs mb-6 animate-in fade-in duration-300">
          <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
          <span>Interactive English Learning & Full Quiz Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {t('heroTitle')}
          <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('tagline')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => setCurrentView('register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('register')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 hover:-translate-y-0.5 shadow-sm transition-all"
          >
            {t('loginBtn')}
          </button>
        </div>

        {/* Guest Mode Link */}
        <div className="mt-4">
          <button
            onClick={() => setCurrentView('register')}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 underline underline-offset-4 transition-colors"
          >
            {t('guestMode')}
          </button>
        </div>

        {/* Interactive Stats Ribbon */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-md">
          <div className="p-3 text-center border-r border-slate-200/60 dark:border-slate-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">6 Levels</div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">CEFR A1 to C2</p>
          </div>
          <div className="p-3 text-center border-r border-slate-200/60 dark:border-slate-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">20-50 Qs</div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Flexible Quiz Lengths</p>
          </div>
          <div className="p-3 text-center border-r border-slate-200/60 dark:border-slate-700/60 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">AI Tutor</div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">English & Uzbek</p>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100% Free</div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Open Learning</p>
          </div>
        </div>
      </section>

      {/* CEFR Level Selector Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('chooseLevelHeading')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t('chooseLevelSub')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {levelsPreview.map((lvl) => (
            <div
              key={lvl.level}
              onClick={() => setCurrentView('register')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-md ${lvl.color}`}
            >
              <div className="text-2xl font-black">{lvl.level}</div>
              <div className="text-xs font-bold mt-1 truncate">{lvl.name}</div>
              <div className="mt-3 text-[11px] font-semibold flex items-center gap-1 opacity-80">
                <span>Select</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comprehensive Benefits Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('benefitsTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Everything structured clearly from vocabulary memorization to certified grammar standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${b.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
