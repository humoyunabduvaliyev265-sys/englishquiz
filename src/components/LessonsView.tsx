import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { TOPICS } from '../data/topics';
import { CEFRLevel, TopicLesson } from '../types';
import { sound, speakEnglish } from '../services/sound';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Volume2,
  Sparkles,
  FileQuestion,
  ChevronLeft,
  GraduationCap,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const LessonsView: React.FC = () => {
  const {
    user,
    activeLesson,
    setActiveLesson,
    completeLesson,
    setCurrentView,
    setSelectedTopicForQuiz,
  } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const [filterLevel, setFilterLevel] = useState<CEFRLevel>(user?.level || 'A1');
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, number>>({});
  const [checkedExercises, setCheckedExercises] = useState<Record<number, boolean>>({});

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredTopics = TOPICS.filter((topic) => topic.level === filterLevel);

  // If a lesson is actively open for reading:
  if (activeLesson) {
    const isCompleted = user?.completedLessons.includes(activeLesson.id);

    const handleAnswerSelect = (exIndex: number, optIndex: number) => {
      setExerciseAnswers({ ...exerciseAnswers, [exIndex]: optIndex });
    };

    const handleCheckExercise = (exIndex: number, correctIndex: number) => {
      setCheckedExercises({ ...checkedExercises, [exIndex]: true });
      const chosen = exerciseAnswers[exIndex];
      if (chosen === correctIndex) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
    };

    const handleTakeTopicQuiz = () => {
      setSelectedTopicForQuiz(activeLesson.id);
      setCurrentView('quiz-config');
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Back navigation & header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveLesson(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Topics</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
              Level {activeLesson.level}
            </span>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activeLesson.estimatedMinutes} min
            </span>
          </div>
        </div>

        {/* Lesson Title Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-100 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>CEFR English Curriculum • {activeLesson.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{activeLesson.title}</h1>
          <p className="mt-1 text-sm text-blue-100 font-medium">
            🇺🇿 {activeLesson.titleUz}
          </p>
          <p className="mt-3 text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
            {lang === 'uz' ? activeLesson.descriptionUz : activeLesson.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => completeLesson(activeLesson.id)}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed (+50 XP Earned)' : 'Mark as Completed (+50 XP)'}</span>
            </button>

            <button
              onClick={handleTakeTopicQuiz}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500/40 hover:bg-purple-500/60 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <FileQuestion className="w-4 h-4" />
              <span>Take a Quiz on This Topic</span>
            </button>
          </div>
        </div>

        {/* Clear Explanation Section */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Grammar & Meaning Explanation</span>
          </h2>
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
            <p>{activeLesson.explanation}</p>
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block mb-1">
                🇺🇿 O‘zbekcha tushuntirish:
              </span>
              <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                {activeLesson.explanationUz}
              </p>
            </div>
          </div>
        </section>

        {/* Important Rules & Examples */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Core Rules & Sentence Examples</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLesson.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {rule.rule}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      🇺🇿 {rule.ruleUz}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      "{rule.example}"
                    </span>
                    <button
                      onClick={() => speakEnglish(rule.example)}
                      title="Listen audio"
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    🇺🇿 {rule.exampleUz}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vocabulary Cards for this topic */}
        {activeLesson.vocabularyCards.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Key Vocabulary in this Topic</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeLesson.vocabularyCards.map((vc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                        {vc.word}
                      </span>
                      <button
                        onClick={() => speakEnglish(vc.word)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {vc.phonetic}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      🇺🇿 {vc.uzbek}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 italic">
                    "{vc.example}"
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Check-Your-Understanding Exercises */}
        {activeLesson.exercises.length > 0 && (
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <span>Quick Understanding Check</span>
              </h2>
              <span className="text-xs text-slate-400">Immediate Answer Feedback</span>
            </div>

            <div className="space-y-6">
              {activeLesson.exercises.map((ex, exIdx) => {
                const selected = exerciseAnswers[exIdx];
                const isChecked = checkedExercises[exIdx];

                return (
                  <div
                    key={exIdx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {exIdx + 1}. {ex.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ex.options.map((opt, optIdx) => {
                        let btnStyle =
                          'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400';

                        if (isChecked) {
                          if (optIdx === ex.correctIndex) {
                            btnStyle =
                              'bg-emerald-500 border-emerald-600 text-white font-bold shadow-xs';
                          } else if (optIdx === selected) {
                            btnStyle =
                              'bg-rose-500 border-rose-600 text-white font-bold shadow-xs';
                          }
                        } else if (selected === optIdx) {
                          btnStyle =
                            'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !isChecked && handleAnswerSelect(exIdx, optIdx)}
                            className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isChecked ? (
                      <button
                        onClick={() => handleCheckExercise(exIdx, ex.correctIndex)}
                        disabled={selected === undefined}
                        className="py-1.5 px-4 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                          {selected === ex.correctIndex ? '✅ Correct!' : '❌ Incorrect!'}
                        </span>
                        <p className="text-slate-600 dark:text-slate-300">{ex.explanation}</p>
                        <p className="text-[11px] text-slate-400 mt-1">🇺🇿 {ex.explanationUz}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Ready to test your knowledge on {activeLesson.title}?
            </h3>
            <p className="text-xs text-slate-500">
              Configure question length (20 to 50 questions) and take the test.
            </p>
          </div>
          <button
            onClick={handleTakeTopicQuiz}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center justify-center gap-2"
          >
            <span>Take Topic Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Listing View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            English Curriculum & Lessons
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Structured step-by-step topics from CEFR A1 (Beginner) to C2 (Proficient).
          </p>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const isDone = user?.completedLessons.includes(topic.id);

          return (
            <div
              key={topic.id}
              onClick={() => setActiveLesson(topic)}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    Level {topic.level} • {topic.category}
                  </span>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  🇺🇿 {topic.titleUz}
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {lang === 'uz' ? topic.descriptionUz : topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {topic.estimatedMinutes} mins
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Start Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
