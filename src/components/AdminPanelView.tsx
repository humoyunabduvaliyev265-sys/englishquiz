import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { CEFRLevel, QuizQuestion, VocabWord } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  FileQuestion,
  BookA,
  BarChart,
  Lock,
  ArrowRight,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { user, addCustomQuestion, addCustomWord, customQuestions, customWords } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(user?.role === 'admin');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'questions' | 'vocabulary' | 'overview'>('questions');

  // New question form state
  const [qLevel, setQLevel] = useState<CEFRLevel>('A1');
  const [qTopicTitle, setQTopicTitle] = useState('General Grammar');
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qExplanationUz, setQExplanationUz] = useState('');

  // New word form state
  const [wWord, setWWord] = useState('');
  const [wPhonetic, setWPhonetic] = useState('');
  const [wUzbek, setWUzbek] = useState('');
  const [wCategory, setWCategory] = useState('Greetings');
  const [wExample, setWExample] = useState('');
  const [wExampleUz, setWExampleUz] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default authorized teacher/admin passcode
    if (adminPasscode === 'admin123' || adminPasscode === 'teacher2026') {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qOptA.trim() || !qOptB.trim()) {
      alert('Please fill out question text and at least options A and B.');
      return;
    }

    const newQ: QuizQuestion = {
      id: 'custom_q_' + Date.now(),
      level: qLevel,
      topicId: 'custom',
      topicTitle: qTopicTitle,
      difficulty: qDifficulty,
      question: qText,
      options: [qOptA, qOptB, qOptC || 'None', qOptD || 'Other'],
      correctIndex: qCorrectIdx,
      explanation: qExplanation || 'Standard English grammar rule.',
      explanationUz: qExplanationUz || "Ingliz tili qoidasiga ko'ra.",
    };

    addCustomQuestion(newQ);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setQExplanationUz('');
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wWord.trim() || !wUzbek.trim()) {
      alert('Please provide at least the English word and Uzbek translation.');
      return;
    }

    const newW: VocabWord = {
      id: 'custom_w_' + Date.now(),
      word: wWord,
      phonetic: wPhonetic || `/${wWord.toLowerCase()}/`,
      partOfSpeech: 'noun',
      uzbek: wUzbek,
      russian: '',
      category: wCategory,
      level: 'A1',
      example: wExample || `Example sentence for ${wWord}.`,
      exampleUz: wExampleUz || `${wWord} uchun namunaviy gap.`,
    };

    addCustomWord(newW);
    setWWord('');
    setWPhonetic('');
    setWUzbek('');
    setWExample('');
    setWExampleUz('');
  };

  // If not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in duration-200">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Administrator Portal
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Authorized teachers & admins only. Enter your administrator passcode.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="password"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="Admin passcode (e.g. admin123)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <span>Authenticate as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Hint for review: use passcode <code className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Admin & Curriculum Studio
          </h1>
          <p className="text-xs text-slate-500">
            Publish and manage quiz questions, vocabulary flashcards, and student learning records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'questions' ? 'bg-indigo-600 text-white' : 'text-slate-500'
            }`}
          >
            Create Question
          </button>
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'vocabulary' ? 'bg-indigo-600 text-white' : 'text-slate-500'
            }`}
          >
            Add Vocabulary
          </button>
        </div>
      </div>

      {/* CREATE QUESTION */}
      {activeTab === 'questions' && (
        <form
          onSubmit={handleCreateQuestion}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <span>Create New Level-Based Quiz Question</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                CEFR Level
              </label>
              <select
                value={qLevel}
                onChange={(e) => setQLevel(e.target.value as CEFRLevel)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Difficulty
              </label>
              <select
                value={qDifficulty}
                onChange={(e) => setQDifficulty(e.target.value as any)}
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Topic Title
              </label>
              <input
                type="text"
                value={qTopicTitle}
                onChange={(e) => setQTopicTitle(e.target.value)}
                placeholder="e.g. Present Continuous"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Question Text (in English) *
            </label>
            <input
              type="text"
              required
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="e.g. She ___ playing tennis right now."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Option A:
              </label>
              <input
                type="text"
                required
                value={qOptA}
                onChange={(e) => setQOptA(e.target.value)}
                placeholder="Option A"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Option B:
              </label>
              <input
                type="text"
                required
                value={qOptB}
                onChange={(e) => setQOptB(e.target.value)}
                placeholder="Option B"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Option C:
              </label>
              <input
                type="text"
                value={qOptC}
                onChange={(e) => setQOptC(e.target.value)}
                placeholder="Option C"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Option D:
              </label>
              <input
                type="text"
                value={qOptD}
                onChange={(e) => setQOptD(e.target.value)}
                placeholder="Option D"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Correct Option Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Select Correct Option
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setQCorrectIdx(idx)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    qCorrectIdx === idx
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  Option {letter} Correct
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                English Explanation
              </label>
              <input
                type="text"
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Why is this answer correct?"
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Uzbek Explanation
              </label>
              <input
                type="text"
                value={qExplanationUz}
                onChange={(e) => setQExplanationUz(e.target.value)}
                placeholder="O'zbekcha qoida tushuntirishi..."
                className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Question to Quiz Pool</span>
          </button>
        </form>
      )}

      {/* ADD VOCABULARY */}
      {activeTab === 'vocabulary' && (
        <form
          onSubmit={handleCreateWord}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookA className="w-5 h-5 text-indigo-600" />
            <span>Add New Vocabulary Word</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                English Word *
              </label>
              <input
                type="text"
                required
                value={wWord}
                onChange={(e) => setWWord(e.target.value)}
                placeholder="e.g. Delicious"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Phonetic Notation
              </label>
              <input
                type="text"
                value={wPhonetic}
                onChange={(e) => setWPhonetic(e.target.value)}
                placeholder="e.g. /dɪˈlɪʃəs/"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Uzbek Translation *
              </label>
              <input
                type="text"
                required
                value={wUzbek}
                onChange={(e) => setWUzbek(e.target.value)}
                placeholder="e.g. Mazali / Shirin"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={wCategory}
                onChange={(e) => setWCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Food">Food</option>
                <option value="Greetings">Greetings</option>
                <option value="Animals">Animals</option>
                <option value="Common Verbs">Common Verbs</option>
                <option value="Common Adjectives">Common Adjectives</option>
                <option value="Travel">Travel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Example Sentence (English)
            </label>
            <input
              type="text"
              value={wExample}
              onChange={(e) => setWExample(e.target.value)}
              placeholder="e.g. This Uzbek plov is truly delicious."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Example Sentence (Uzbek)
            </label>
            <input
              type="text"
              value={wExampleUz}
              onChange={(e) => setWExampleUz(e.target.value)}
              placeholder="e.g. Bu palov haqiqatan ham juda mazali."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Add Word to Flashcard Pool</span>
          </button>
        </form>
      )}
    </div>
  );
};
