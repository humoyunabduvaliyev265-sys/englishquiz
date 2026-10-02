import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { VocabWord, WordStatus } from '../types';
import { sound, speakEnglish } from '../services/sound';
import {
  BookA,
  Volume2,
  CheckCircle2,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
  Search,
} from 'lucide-react';

export const VocabularyBuilder: React.FC = () => {
  const { user, updateWordStatus, customWords } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const combinedWords = [...VOCABULARY_LIST, ...customWords];

  const categories = [
    'All',
    'Greetings',
    'Family',
    'Numbers',
    'Colors',
    'Animals',
    'Food',
    'Drinks',
    'School',
    'Home',
    'Clothes',
    'Days & Months',
    'Common Verbs',
    'Common Adjectives',
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'review' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'cards' | 'flashcards' | 'quiz'>('flashcards');

  // Flashcards mode states
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Vocab Quiz mode states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Filter words
  let filtered = combinedWords.filter((w) => {
    if (selectedCategory !== 'All' && w.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!w.word.toLowerCase().includes(q) && !w.uzbek.toLowerCase().includes(q)) return false;
    }
    const currentStatus = user?.wordStatuses[w.id] || 'new';
    if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    filtered = combinedWords.slice(0, 10);
  }

  const currentFlashcard = filtered[flashcardIndex % filtered.length];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filtered.length);
    sound.playClick();
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    sound.playClick();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setFlashcardIndex(Math.floor(Math.random() * filtered.length));
    sound.playClick();
  };

  // Generate 4 options for mini vocab quiz
  const currentQuizWord = filtered[quizIndex % filtered.length];
  const generateQuizOptions = () => {
    const correct = currentQuizWord?.uzbek || '';
    const distractors = combinedWords
      .filter((w) => w.id !== currentQuizWord?.id)
      .map((w) => w.uzbek)
      .slice(0, 3);
    const opts = [correct, ...distractors];
    return opts.sort(() => 0.5 - Math.random());
  };
  const [quizOptions, setQuizOptions] = useState<string[]>(generateQuizOptions);

  const handleCheckQuizAnswer = (optIndex: number) => {
    setSelectedQuizOption(optIndex);
    setQuizAnswerChecked(true);
    const chosen = quizOptions[optIndex];
    if (chosen === currentQuizWord.uzbek) {
      sound.playCorrect();
      setQuizScore((prev) => prev + 1);
      updateWordStatus(currentQuizWord.id, 'mastered');
    } else {
      sound.playIncorrect();
      updateWordStatus(currentQuizWord.id, 'learning');
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    setQuizAnswerChecked(false);
    const nextIdx = quizIndex + 1;
    setQuizIndex(nextIdx);
    const nextWord = filtered[nextIdx % filtered.length];
    const correct = nextWord?.uzbek || '';
    const distractors = combinedWords
      .filter((w) => w.id !== nextWord?.id)
      .map((w) => w.uzbek)
      .slice(0, 3);
    setQuizOptions([correct, ...distractors].sort(() => 0.5 - Math.random()));
    sound.playClick();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <BookA className="w-3.5 h-3.5" />
            <span>A1 & A2 Vocabulary Memory System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('vocabTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('vocabSub')}
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            3D Flashcards
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'cards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Word List
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Vocab Quiz
          </button>
        </div>
      </div>

      {/* Filter Row: Category & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories scrollable pill list */}
        <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-2xl no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search English or Uzbek..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* MODE 1: 3D INTERACTIVE FLASHCARDS                  */}
      {/* -------------------------------------------------- */}
      {activeTab === 'flashcards' && currentFlashcard && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Card counter */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>
              Card {(flashcardIndex % filtered.length) + 1} of {filtered.length}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {currentFlashcard.category}
            </span>
          </div>

          {/* Flashcard container with 3D Flip */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-72 sm:h-80 w-full cursor-pointer perspective-1000 group"
          >
            <div
              className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl border-2 border-slate-200 dark:border-slate-700 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT (English) */}
              <div className="absolute inset-0 backface-hidden rounded-3xl bg-white dark:bg-slate-800 p-8 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">
                    {currentFlashcard.partOfSpeech}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakEnglish(currentFlashcard.word);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                    {currentFlashcard.word}
                  </h2>
                  <p className="font-mono text-slate-400 text-sm">
                    {currentFlashcard.phonetic}
                  </p>
                </div>

                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{t('flipCard')}</span>
                </span>
              </div>

              {/* BACK (Uzbek & Example) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-between items-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  O‘zbekcha Tarjima
                </span>

                <div className="space-y-3">
                  <h3 className="text-3xl sm:text-4xl font-black">
                    {currentFlashcard.uzbek}
                  </h3>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-xs sm:text-sm text-white/95 leading-relaxed max-w-sm">
                    <p className="font-medium">"{currentFlashcard.example}"</p>
                    <p className="text-xs text-blue-200 mt-1 italic">
                      🇺🇿 {currentFlashcard.exampleUz}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-blue-200">Click to flip back</span>
              </div>
            </div>
          </div>

          {/* Flashcard Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevFlashcard}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleShuffle}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5"
            >
              <Shuffle className="w-4 h-4" />
              <span>{t('shuffle')}</span>
            </button>

            <button
              onClick={() => updateWordStatus(currentFlashcard.id, 'mastered')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('markLearned')}</span>
            </button>

            <button
              onClick={handleNextFlashcard}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* MODE 2: WORD LIST GRID                             */}
      {/* -------------------------------------------------- */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => {
            const status = user?.wordStatuses[w.id] || 'new';

            return (
              <div
                key={w.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {w.word}
                    </span>
                    <button
                      onClick={() => speakEnglish(w.word)}
                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{w.phonetic}</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    🇺🇿 {w.uzbek}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                    "{w.example}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      status === 'mastered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : status === 'learning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>

                  <button
                    onClick={() =>
                      updateWordStatus(w.id, status === 'mastered' ? 'learning' : 'mastered')
                    }
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {status === 'mastered' ? 'Mark Learning' : 'Mark Mastered'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* MODE 3: VOCABULARY QUIZ                            */}
      {/* -------------------------------------------------- */}
      {activeTab === 'quiz' && currentQuizWord && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Vocab Test: Question {quizIndex + 1}</span>
            <span className="text-emerald-600">Score: {quizScore}</span>
          </div>

          <div className="text-center space-y-2 py-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose the correct translation:
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {currentQuizWord.word}
            </h2>
            <button
              onClick={() => speakEnglish(currentQuizWord.word)}
              className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>

          {/* 4 Choices */}
          <div className="space-y-3">
            {quizOptions.map((opt, optIdx) => {
              const isSelected = selectedQuizOption === optIdx;
              const isCorrect = opt === currentQuizWord.uzbek;

              let btnStyle =
                'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-800 dark:text-slate-200 hover:border-blue-400';

              if (quizAnswerChecked) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100 font-bold';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={quizAnswerChecked}
                  onClick={() => handleCheckQuizAnswer(optIdx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizAnswerChecked && (
            <button
              onClick={handleNextQuizQuestion}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Next Word</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
