import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { generateQuizQuestions } from '../services/quizGenerator';
import {
  CEFRLevel,
  QuizAnswerRecord,
  QuizConfig,
  QuizQuestion,
  QuizResult,
} from '../types';
import { sound } from '../services/sound';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  BarChart,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const QuizEngine: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    activeQuizResult,
    recordQuizResult,
    selectedTopicForQuiz,
    setSelectedTopicForQuiz,
  } = useApp();

  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  // Configuration State
  const [questionCount, setQuestionCount] = useState<20 | 25 | 30 | 40 | 50>(20);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [level, setLevel] = useState<CEFRLevel>(user?.level || 'A1');
  const [timedMode, setTimedMode] = useState(user?.timerEnabled ?? true);

  // Active Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [answerRecords, setAnswerRecords] = useState<QuizAnswerRecord[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(45); // 45s per question
  const [startTime, setStartTime] = useState<number>(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Start Quiz
  const handleStartQuiz = () => {
    const config: QuizConfig = {
      questionCount,
      difficulty,
      level,
      topicId: selectedTopicForQuiz || undefined,
      timed: timedMode,
    };

    const questions = generateQuizQuestions(config);
    setQuizQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setAnswerRecords([]);
    setStartTime(Date.now());
    setSecondsRemaining(45);
    setCurrentView('quiz-active');
    sound.playClick();
  };

  // Timer countdown
  useEffect(() => {
    if (currentView !== 'quiz-active' || !timedMode) return;
    if (submittedAnswers[currentIndex]) return; // Stop timer if current question is already submitted

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit current answer if selected, or mark incorrect if none selected
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentView, currentIndex, submittedAnswers, timedMode]);

  // Reset timer on slide change
  useEffect(() => {
    setSecondsRemaining(45);
  }, [currentIndex]);

  const handleSelectOption = (optionIndex: number) => {
    // If already submitted this question, do not allow changing
    if (submittedAnswers[currentIndex]) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optionIndex });
    sound.playClick();
  };

  const handleSubmitCurrentAnswer = () => {
    const currentQ = quizQuestions[currentIndex];
    const selectedOpt = selectedAnswers[currentIndex];
    if (selectedOpt === undefined) return;

    const isCorrect = selectedOpt === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    setSubmittedAnswers({ ...submittedAnswers, [currentIndex]: true });

    // Record answer
    const record: QuizAnswerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      options: currentQ.options,
      selectedIndex: selectedOpt,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      explanation: currentQ.explanation,
      explanationUz: currentQ.explanationUz,
    };

    // Update records
    const updated = [...answerRecords];
    updated[currentIndex] = record;
    setAnswerRecords(updated);
  };

  const handleAutoSubmit = () => {
    if (submittedAnswers[currentIndex]) return;
    const currentQ = quizQuestions[currentIndex];
    const selectedOpt = selectedAnswers[currentIndex] ?? -1;
    const isCorrect = selectedOpt === currentQ.correctIndex;

    setSubmittedAnswers((prev) => ({ ...prev, [currentIndex]: true }));
    sound.playIncorrect();

    const record: QuizAnswerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      options: currentQ.options,
      selectedIndex: selectedOpt,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      explanation: currentQ.explanation,
      explanationUz: currentQ.explanationUz,
    };

    setAnswerRecords((prev) => {
      const copy = [...prev];
      copy[currentIndex] = record;
      return copy;
    });
  };

  const handleFinishQuiz = () => {
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const totalQ = quizQuestions.length;

    // Fill any skipped questions as unselected/incorrect
    const finalizedRecords: QuizAnswerRecord[] = quizQuestions.map((q, idx) => {
      if (answerRecords[idx]) return answerRecords[idx];
      const selected = selectedAnswers[idx] ?? -1;
      return {
        questionId: q.id,
        questionText: q.question,
        options: q.options,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect: selected === q.correctIndex,
        explanation: q.explanation,
        explanationUz: q.explanationUz,
      };
    });

    const correctCount = finalizedRecords.filter((r) => r.isCorrect).length;
    const scorePct = Math.round((correctCount / totalQ) * 100);

    // Compute earned XP based on accuracy
    const xpEarned = Math.round(correctCount * 10 + (scorePct >= 70 ? 50 : 10));

    const result: QuizResult = {
      id: 'quiz_' + Date.now(),
      date: new Date().toISOString(),
      level,
      topicTitle: selectedTopicForQuiz ? 'Specific Topic Quiz' : `Comprehensive Level ${level} Test`,
      questionCount: totalQ,
      correctCount,
      scorePercentage: scorePct,
      timeSpentSeconds: timeSpent,
      xpEarned,
      answers: finalizedRecords,
    };

    recordQuizResult(result);
    setCurrentView('quiz-results');

    // Confetti celebration if passed with >= 70%
    if (scorePct >= 70) {
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playClick();
    }
  };

  // ----------------------------------------------------
  // VIEW: QUIZ CONFIGURATION
  // ----------------------------------------------------
  if (currentView === 'quiz-config') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-xs font-bold">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Official ENGLISH QUIZ Assessment Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t('chooseQuizLength')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('quizLengthSub')}
          </p>
        </div>

        {/* 5 Selectable Question Counts as strictly required */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Number of Questions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[20, 25, 30, 40, 50].map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count as any)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl font-black">{count}</div>
                  <div className="text-[11px] font-bold mt-1 opacity-80">Questions</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('selectDifficulty')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'easy', label: t('easy'), color: 'text-emerald-600' },
              { id: 'medium', label: t('medium'), color: 'text-blue-600' },
              { id: 'hard', label: t('hard'), color: 'text-purple-600' },
              { id: 'mixed', label: t('mixed'), color: 'text-amber-600' },
            ].map((d) => {
              const isSelected = difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id as any)}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <span className={d.color}>{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level & Topic Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Active CEFR Level:
            </span>
            <div className="flex gap-1">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    level === lvl
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={timedMode}
              onChange={(e) => setTimedMode(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Enable 45s Question Timer</span>
          </label>
        </div>

        {selectedTopicForQuiz && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs">
            <span className="text-purple-900 dark:text-purple-200 font-semibold">
              🎯 Specific Topic Filter Active ({selectedTopicForQuiz})
            </span>
            <button
              onClick={() => setSelectedTopicForQuiz(null)}
              className="font-bold text-purple-700 underline"
            >
              Reset to General Quiz
            </button>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          className="w-full py-4 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2"
        >
          <span>{t('startQuiz')} ({questionCount} Questions)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: ACTIVE QUIZ IN PROGRESS
  // ----------------------------------------------------
  if (currentView === 'quiz-active') {
    const currentQ = quizQuestions[currentIndex];
    if (!currentQ) return null;

    const totalQ = quizQuestions.length;
    const progressPercent = Math.round(((currentIndex + 1) / totalQ) * 100);
    const selectedOpt = selectedAnswers[currentIndex];
    const isSubmitted = !!submittedAnswers[currentIndex];
    const isCorrect = isSubmitted && selectedOpt === currentQ.correctIndex;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
        {/* Top Header: Level, Topic, Question Progress, Timer */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Level {currentQ.level}
            </span>
            <span>{currentQ.topicTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            {timedMode && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  secondsRemaining <= 10
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsRemaining}s</span>
              </div>
            )}
            <span className="text-slate-900 dark:text-white">
              {t('questionCounter', { current: currentIndex + 1, total: totalQ })}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const isOptionSelected = selectedOpt === optIdx;
              const isOptionCorrect = optIdx === currentQ.correctIndex;

              // Color handling strictly as requested:
              // - Correct turns GREEN
              // - Incorrect selection turns RED and correct turns GREEN
              let containerStyle =
                'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50/50';

              if (isSubmitted) {
                if (isOptionCorrect) {
                  containerStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500/30';
                } else if (isOptionSelected && !isOptionCorrect) {
                  containerStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/30';
                } else {
                  containerStyle =
                    'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 opacity-60';
                }
              } else if (isOptionSelected) {
                containerStyle =
                  'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 font-bold shadow-xs';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm transition-all flex items-center justify-between ${containerStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center border ${
                        isSubmitted && isOptionCorrect
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : isSubmitted && isOptionSelected
                          ? 'bg-rose-500 border-rose-600 text-white'
                          : isOptionSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-semibold">{optionText}</span>
                  </div>

                  {isSubmitted && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isSubmitted && isOptionSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner (appears after submitting) */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl text-xs space-y-1.5 border animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('correctAnswer')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{t('incorrectAnswer')}</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                {currentQ.explanation}
              </p>
              {currentQ.explanationUz && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                  🇺🇿 {currentQ.explanationUz}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('previousQuestion')}</span>
          </button>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitCurrentAnswer}
                disabled={selectedOpt === undefined}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 shadow-sm transition-all"
              >
                {t('submitAnswer')}
              </button>
            ) : currentIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>{t('nextQuestion')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center gap-1.5 transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>{t('finishQuiz')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: QUIZ RESULTS & SCORE PAGE
  // ----------------------------------------------------
  if (currentView === 'quiz-results' && activeQuizResult) {
    const res = activeQuizResult;
    const isPassed = res.scorePercentage >= 70;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">
        {/* Congratulatory Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
          <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-slate-700"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * res.scorePercentage) / 100}
                className={isPassed ? 'text-emerald-500' : 'text-amber-500'}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {res.scorePercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accuracy
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isPassed ? 'Congratulations, ' + (user?.firstName || 'Student') + '!' : 'Good Effort, Keep Practicing!'}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              You answered <span className="font-bold text-emerald-600 dark:text-emerald-400">{res.correctCount}</span> out of{' '}
              <span className="font-bold">{res.questionCount}</span> questions correctly.
            </p>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-center">
              <span className="text-xs text-slate-400 block">{t('correct')}</span>
              <span className="text-lg font-bold text-emerald-600">{res.correctCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-center">
              <span className="text-xs text-slate-400 block">{t('incorrect')}</span>
              <span className="text-lg font-bold text-rose-600">{res.questionCount - res.correctCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-center">
              <span className="text-xs text-slate-400 block">{t('timeSpent')}</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-center">
              <span className="text-xs text-slate-400 block">{t('xpEarned')}</span>
              <span className="text-lg font-bold text-blue-600">+{res.xpEarned} XP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setIsReviewMode(true);
                setCurrentView('quiz-review');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-xs flex items-center justify-center gap-2"
            >
              <FileQuestion className="w-4 h-4 text-blue-600" />
              <span>{t('reviewAnswers')}</span>
            </button>

            <button
              onClick={() => setCurrentView('quiz-config')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('retakeQuiz')}</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>{t('backToDashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: DETAILED QUESTION-BY-QUESTION REVIEW
  // ----------------------------------------------------
  if (currentView === 'quiz-review' && activeQuizResult) {
    const res = activeQuizResult;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('reviewAnswers')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Score: {res.scorePercentage}% ({res.correctCount}/{res.questionCount} Correct)
            </p>
          </div>

          <button
            onClick={() => setCurrentView('quiz-results')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            Back to Results
          </button>
        </div>

        <div className="space-y-4">
          {res.answers.map((ans, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 shadow-xs space-y-3 ${
                ans.isCorrect
                  ? 'border-emerald-500/40'
                  : 'border-rose-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 text-white ${
                      ans.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {ans.questionText}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    ans.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {ans.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              {/* Options Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {ans.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 dark:border-slate-700 text-slate-500';
                  if (optIdx === ans.correctIndex) {
                    optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (optIdx === ans.selectedIndex) {
                    optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold';
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {optIdx === ans.correctIndex && (
                        <span className="text-[10px] uppercase font-bold text-emerald-600">Correct Answer</span>
                      )}
                      {optIdx === ans.selectedIndex && optIdx !== ans.correctIndex && (
                        <span className="text-[10px] uppercase font-bold text-rose-600">Your Choice</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grammar Explanation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                  Explanation:
                </span>
                <p>{ans.explanation}</p>
                {ans.explanationUz && (
                  <p className="text-[11px] text-slate-400 mt-1">🇺🇿 {ans.explanationUz}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
