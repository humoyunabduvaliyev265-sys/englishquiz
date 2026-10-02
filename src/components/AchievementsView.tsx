import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { INITIAL_ACHIEVEMENTS } from '../data/skillsPractice';
import {
  Trophy,
  Award,
  Flame,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { user } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return GraduationCap;
      case 'Award':
        return Award;
      case 'BookOpen':
        return BookOpen;
      case 'Flame':
        return Flame;
      default:
        return Trophy;
    }
  };

  const completedLessonCount = user?.completedLessons.length || 0;
  const quizCount = user?.quizHistory.length || 0;
  const wordsLearnedCount = Object.values(user?.wordStatuses || {}).filter(
    (s) => s === 'mastered'
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gamification & Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('cardAchievementsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Earn badges, build learning streaks, and gain recognition.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Experience</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {user?.xp || 0} XP
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_ACHIEVEMENTS.map((ach) => {
          const Icon = getIcon(ach.icon);

          // Dynamic progress checks
          let currentProgress = 0;
          let isUnlocked = false;

          if (ach.id === 'ach-first-lesson') {
            currentProgress = Math.min(1, completedLessonCount);
            isUnlocked = completedLessonCount >= 1;
          } else if (ach.id === 'ach-first-quiz') {
            currentProgress = Math.min(1, quizCount);
            isUnlocked = (user?.quizHistory.some((q) => q.scorePercentage >= 70)) ?? false;
          } else if (ach.id === 'ach-vocab-50') {
            currentProgress = Math.min(25, wordsLearnedCount);
            isUnlocked = wordsLearnedCount >= 25;
          } else if (ach.id === 'ach-streak-3') {
            currentProgress = Math.min(3, user?.streak || 1);
            isUnlocked = (user?.streak || 1) >= 3;
          } else if (ach.id === 'ach-quiz-master') {
            currentProgress = Math.min(5, quizCount);
            isUnlocked = quizCount >= 5;
          }

          const pct = Math.min(100, Math.round((currentProgress / ach.max) * 100));

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 transition-all flex flex-col justify-between shadow-xs ${
                isUnlocked
                  ? 'border-amber-400/60 dark:border-amber-500/40 shadow-amber-500/5'
                  : 'border-slate-200 dark:border-slate-700 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'uz' ? ach.titleUz : ach.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'uz' ? ach.descriptionUz : ach.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-500">
                  <span>Progress</span>
                  <span>
                    {currentProgress} / {ach.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-bold text-amber-600">
                    +{ach.xpReward} XP Reward
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
