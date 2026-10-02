import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { CEFRLevel } from '../types';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Zap,
  Target,
  Crown,
  Award,
} from 'lucide-react';

interface LevelCardInfo {
  level: CEFRLevel;
  title: string;
  cefr: string;
  difficulty: string;
  description: string;
  descriptionUz: string;
  colorBorder: string;
  colorGradient: string;
  badgeBg: string;
  icon: any;
}

export const LevelSelector: React.FC = () => {
  const { user, selectLevel, setCurrentView } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const levels: LevelCardInfo[] = [
    {
      level: 'A1',
      title: 'Beginner',
      cefr: 'Basic User (Breakthrough)',
      difficulty: 'Level 1 • Easy',
      description: 'Learn basic English words, greetings, simple sentences, and everyday expressions.',
      descriptionUz: 'Asosiy inglizcha so\'zlar, salomlashish, sodda gaplar va kundalik iboralar.',
      colorBorder: 'border-emerald-500/40 hover:border-emerald-500',
      colorGradient: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
      icon: BookOpen,
    },
    {
      level: 'A2',
      title: 'Elementary',
      cefr: 'Basic User (Waystage)',
      difficulty: 'Level 2 • Basic',
      description: 'Learn everyday conversations, basic grammar, useful vocabulary, and simple reading.',
      descriptionUz: 'Kundalik suhbatlar, asosiy grammatika, sayohat va xarid so\'zlari.',
      colorBorder: 'border-blue-500/40 hover:border-blue-500',
      colorGradient: 'from-blue-500 to-cyan-600',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
      icon: Compass,
    },
    {
      level: 'B1',
      title: 'Intermediate',
      cefr: 'Independent User (Threshold)',
      difficulty: 'Level 3 • Moderate',
      description: 'Improve communication, understand everyday texts, learn tenses, and express opinions.',
      descriptionUz: 'Muloqotni rivojlantirish, o\'tgan va tugallangan zamonlar, shaxsiy fikr bildirish.',
      colorBorder: 'border-indigo-500/40 hover:border-indigo-500',
      colorGradient: 'from-indigo-500 to-blue-600',
      badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
      icon: Zap,
    },
    {
      level: 'B2',
      title: 'Upper Intermediate',
      cefr: 'Independent User (Vantage)',
      difficulty: 'Level 4 • Intermediate',
      description: 'Develop fluent communication, advanced grammar, longer texts, and complex vocabulary.',
      descriptionUz: 'Ravon so\'zlashuv, murakkab zamonlar, biznes va akademik ingliz tili asoslari.',
      colorBorder: 'border-purple-500/40 hover:border-purple-500',
      colorGradient: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
      icon: Target,
    },
    {
      level: 'C1',
      title: 'Advanced',
      cefr: 'Proficient User (Effective Operational)',
      difficulty: 'Level 5 • Advanced',
      description: 'Master academic vocabulary, sophisticated grammar, detailed reading, and professional English.',
      descriptionUz: 'Akademik so\'z boyligi, inversiyalar, rasmiy insholar va professional ingliz tili.',
      colorBorder: 'border-amber-500/40 hover:border-amber-500',
      colorGradient: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
      icon: Award,
    },
    {
      level: 'C2',
      title: 'Proficient',
      cefr: 'Proficient User (Mastery)',
      difficulty: 'Level 6 • Native-like',
      description: 'Develop near-native comprehension, nuanced vocabulary, complex writing, and advanced communication.',
      descriptionUz: 'Ona tili darajasidagi nozik tushunish, yuksak idiomalari va uslubiy rang-baranglik.',
      colorBorder: 'border-rose-500/40 hover:border-rose-500',
      colorGradient: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
      icon: Crown,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CEFR International Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('chooseLevelHeading')}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {t('chooseLevelSub')}
        </p>
      </div>

      {/* Grid of 6 interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((item) => {
          const Icon = item.icon;
          const isCurrent = user?.level === item.level;

          return (
            <div
              key={item.level}
              className={`relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-xl ${item.colorBorder} ${
                isCurrent ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              {/* Active Badge if currently selected */}
              {isCurrent && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t('currentLevelBadge')}</span>
                </div>
              )}

              <div>
                {/* Header: Level Code + Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {item.level}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeBg}`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.colorGradient} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Subtitle & CEFR info */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-3">
                  {item.cefr}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {lang === 'uz' ? item.descriptionUz : item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
                <button
                  onClick={() => selectLevel(item.level)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-700'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{isCurrent ? t('continueLearning') : t('startLearning')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
