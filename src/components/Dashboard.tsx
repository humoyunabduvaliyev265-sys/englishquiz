import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  Flame,
  Award,
  BookOpen,
  Sparkles,
  FileQuestion,
  Headphones,
  Mic,
  PenTool,
  Calendar,
  Compass,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Trophy,
  BarChart2,
  Clock,
  Zap,
  BookA,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, setCurrentView, setActiveLesson } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  if (!user) return null;

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString(
    lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  // Compute accuracy
  const totalQuizzes = user.quizHistory.length;
  const avgAccuracy =
    totalQuizzes > 0
      ? Math.round(
          user.quizHistory.reduce((acc, q) => acc + q.scorePercentage, 0) / totalQuizzes
        )
      : 85;

  // Daily goal progress
  const dailyGoalPercent = Math.min(100, Math.round((user.todayXp / user.dailyGoalXp) * 100));

  // 12 functional sections as specified
  const dashboardCards = [
    {
      id: 'lessons',
      title: t('cardContinueTitle'),
      desc: t('cardContinueDesc'),
      icon: Compass,
      color: 'from-blue-600 to-indigo-600',
      tag: `${user.level} Path`,
    },
    {
      id: 'ai-teacher',
      title: t('cardAITeacherTitle'),
      desc: t('cardAITeacherDesc'),
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      tag: 'Gemini AI',
    },
    {
      id: 'lessons',
      title: t('cardGrammarTitle'),
      desc: t('cardGrammarDesc'),
      icon: BookOpen,
      color: 'from-indigo-600 to-blue-700',
      tag: 'A1-C2 Lessons',
    },
    {
      id: 'vocabulary',
      title: t('cardVocabTitle'),
      desc: t('cardVocabDesc'),
      icon: BookA,
      color: 'from-emerald-600 to-teal-600',
      tag: 'Flashcards',
    },
    {
      id: 'quiz-config',
      title: t('cardQuizzesTitle'),
      desc: t('cardQuizzesDesc'),
      icon: FileQuestion,
      color: 'from-amber-600 to-orange-600',
      tag: '20-50 Qs',
    },
    {
      id: 'reading',
      title: t('cardReadingTitle'),
      desc: t('cardReadingDesc'),
      icon: BookOpen,
      color: 'from-cyan-600 to-blue-600',
      tag: 'Passages',
    },
    {
      id: 'listening',
      title: t('cardListeningTitle'),
      desc: t('cardListeningDesc'),
      icon: Headphones,
      color: 'from-violet-600 to-purple-700',
      tag: 'Audio Player',
    },
    {
      id: 'speaking',
      title: t('cardSpeakingTitle'),
      desc: t('cardSpeakingDesc'),
      icon: Mic,
      color: 'from-rose-600 to-red-600',
      tag: 'Voice Practice',
    },
    {
      id: 'writing',
      title: t('cardWritingTitle'),
      desc: t('cardWritingDesc'),
      icon: PenTool,
      color: 'from-fuchsia-600 to-pink-600',
      tag: 'Essay Feedback',
    },
    {
      id: 'reading', // Daily challenge triggers reading/vocab challenge
      title: t('cardDailyChallengeTitle'),
      desc: t('cardDailyChallengeDesc'),
      icon: Zap,
      color: 'from-yellow-500 to-amber-600',
      tag: '+50 XP Bonus',
    },
    {
      id: 'achievements',
      title: t('cardAchievementsTitle'),
      desc: t('cardAchievementsDesc'),
      icon: Trophy,
      color: 'from-amber-500 to-yellow-600',
      tag: 'Milestones',
    },
    {
      id: 'statistics',
      title: t('cardStatsTitle'),
      desc: t('cardStatsDesc'),
      icon: BarChart2,
      color: 'from-teal-600 to-emerald-700',
      tag: 'Charts & Export',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('helloStudent', { name: user.firstName })}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl">
              {t('welcomeBannerSub')}
            </p>
          </div>

          {/* Quick CTA inside banner */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('quiz-config')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
            >
              <FileQuestion className="w-4 h-4 text-blue-600" />
              <span>{t('quickQuiz')}</span>
            </button>
            <button
              onClick={() => setCurrentView('ai-teacher')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-500/40 hover:bg-purple-500/60 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{t('quickAITeacher')}</span>
            </button>
          </div>
        </div>

        {/* Decorative Circle Gradients */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Top Learning Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Level */}
        <div
          onClick={() => setCurrentView('level-select')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-blue-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('level')}</span>
            <Compass className="w-4 h-4 text-blue-500 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.level}
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
            Change Level →
          </span>
        </div>

        {/* Daily Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('streakDays')}</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {user.streak} <span className="text-xs font-normal">days</span>
          </div>
          <span className="text-[10px] text-slate-400">Keep it burning!</span>
        </div>

        {/* Total Points (XP) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('totalXP')}</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {user.xp}
          </div>
          <span className="text-[10px] text-slate-400">All-time points</span>
        </div>

        {/* Lessons Done */}
        <div
          onClick={() => setCurrentView('lessons')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('completedLessons')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {user.completedLessons.length}
          </div>
          <span className="text-[10px] text-slate-400">Curriculum units</span>
        </div>

        {/* Quiz Accuracy */}
        <div
          onClick={() => setCurrentView('statistics')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('quizAccuracy')}</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {avgAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400">
            {totalQuizzes} quizzes taken
          </span>
        </div>

        {/* Daily Goal */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('dailyGoal')}</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.todayXp} / {user.dailyGoalXp} <span className="text-[11px] font-bold text-slate-400">XP</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main 12 Functional Learning Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Learning Modules & Activities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any card to launch interactive lessons, quizzes, AI assistance, or practice.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dashboardCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setCurrentView(card.id as any)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
