import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  BarChart3,
  Download,
  Calendar,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Compass,
  FileQuestion,
  User,
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { user } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  if (!user) return null;

  const quizCount = user.quizHistory.length;
  const avgAccuracy =
    quizCount > 0
      ? Math.round(user.quizHistory.reduce((acc, q) => acc + q.scorePercentage, 0) / quizCount)
      : 80;

  const wordsLearned = Object.values(user.wordStatuses).filter((s) => s === 'mastered').length;

  // Mock weekly activity bars (Mon-Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activityData = [45, 60, 30, 80, 50, 90, user.todayXp || 40];

  const handleExportReport = () => {
    const reportData = {
      platform: 'ENGLISH QUIZ (https://englishquiz.com)',
      student: `${user.firstName} ${user.lastName}`,
      email: user.email || 'Guest',
      cefrLevel: user.level,
      totalXp: user.xp,
      activeStreakDays: user.streak,
      completedLessonsCount: user.completedLessons.length,
      quizzesTaken: quizCount,
      averageQuizAccuracy: `${avgAccuracy}%`,
      wordsMastered: wordsLearned,
      exportTimestamp: new Date().toISOString(),
      quizHistorySummary: user.quizHistory.map((q) => ({
        date: q.date,
        level: q.level,
        topic: q.topicTitle,
        score: `${q.scorePercentage}%`,
        correct: `${q.correctCount}/${q.questionCount}`,
        xpEarned: q.xpEarned,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ENGLISH_QUIZ_Progress_Report_${user.firstName}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Performance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('cardStatsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time tracking of your English mastery, accuracy trends, and curriculum progress.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{t('exportData')}</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div
            className="w-16 h-16 rounded-2xl text-white text-xl font-black flex items-center justify-center shadow-md shrink-0"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-xs text-slate-400">
              Joined on {new Date(user.createdAt).toLocaleDateString()} • {user.email || 'Guest Student'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                CEFR: {user.level}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {user.streak} Days
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-750">
            <span className="text-xs text-slate-400 block">Total XP</span>
            <span className="text-lg font-black text-indigo-600">{user.xp}</span>
          </div>
          <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-750">
            <span className="text-xs text-slate-400 block">Lessons</span>
            <span className="text-lg font-black text-emerald-600">{user.completedLessons.length}</span>
          </div>
          <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-750">
            <span className="text-xs text-slate-400 block">Quizzes</span>
            <span className="text-lg font-black text-purple-600">{quizCount}</span>
          </div>
          <div className="p-3 text-center rounded-xl bg-slate-50 dark:bg-slate-750">
            <span className="text-xs text-slate-400 block">Words Mastered</span>
            <span className="text-lg font-black text-blue-600">{wordsLearned}</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Weekly Learning Activity (XP)</span>
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {activityData.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(15, (val / 100) * 100));
              const isToday = idx === 6;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-400">{val}</span>
                  <div
                    className={`w-full rounded-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-blue-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <span
                    className={`text-xs font-semibold ${
                      isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz Accuracy & Category Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Competency Breakdown</span>
            </h3>
            <span className="text-xs font-bold text-purple-600">Avg {avgAccuracy}%</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { skill: 'Grammar & Syntax', score: avgAccuracy, color: 'bg-indigo-600' },
              { skill: 'Vocabulary & Phrases', score: Math.min(100, avgAccuracy + 5), color: 'bg-emerald-600' },
              { skill: 'Reading Comprehension', score: Math.min(100, avgAccuracy + 2), color: 'bg-cyan-600' },
              { skill: 'Listening & Pronunciation', score: Math.max(50, avgAccuracy - 4), color: 'bg-purple-600' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{s.skill}</span>
                  <span>{s.score}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${s.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${s.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-blue-600" />
          <span>Recent Quiz Sessions & Results</span>
        </h3>

        {user.quizHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No quiz attempts yet. Take your first quiz to see your performance logs here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Topic / Test</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Questions</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">XP Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {user.quizHistory.slice(0, 10).map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(q.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {q.topicTitle}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {q.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {q.correctCount} / {q.questionCount}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={q.scorePercentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}>
                        {q.scorePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-blue-600">
                      +{q.xpEarned} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
