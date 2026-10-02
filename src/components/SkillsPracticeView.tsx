import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  LISTENING_DIALOGUES,
  READING_PASSAGES,
  SPEAKING_PROMPTS,
  WRITING_PROMPTS,
} from '../data/skillsPractice';
import { sound, speakEnglish } from '../services/sound';
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Send,
} from 'lucide-react';

export const SkillsPracticeView: React.FC<{ mode: 'reading' | 'listening' | 'speaking' | 'writing' }> = ({ mode }) => {
  const { user } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  // Reading state
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({});
  const [showUzbekSummary, setShowUzbekSummary] = useState(false);

  // Listening state
  const [selectedDialogueIndex, setSelectedDialogueIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, number>>({});

  // Speaking state
  const [selectedSpeakingIndex, setSelectedSpeakingIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);

  // Writing state
  const [selectedWritingIndex, setSelectedWritingIndex] = useState(0);
  const [writingInput, setWritingInput] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);

  // ----------------------------------------------------
  // READING PRACTICE
  // ----------------------------------------------------
  if (mode === 'reading') {
    const currentPassage = READING_PASSAGES[selectedPassageIndex] || READING_PASSAGES[0];

    const handleSelectReadingAnswer = (qIdx: number, optIdx: number, correctIdx: number) => {
      setReadingAnswers({ ...readingAnswers, [qIdx]: optIdx });
      if (optIdx === correctIdx) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reading Comprehension</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {currentPassage.title}
            </h1>
            <p className="text-xs text-slate-400">🇺🇿 {currentPassage.titleUz}</p>
          </div>

          <div className="flex gap-2">
            {READING_PASSAGES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPassageIndex(idx);
                  setReadingAnswers({});
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPassageIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Passage {idx + 1} ({p.level})
              </button>
            ))}
          </div>
        </div>

        {/* Passage Text */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-normal">
            {currentPassage.passage}
          </div>

          {/* Key Words Highlight */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Key Vocabulary:</span>
            {currentPassage.keyWords.map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
              >
                <strong>{kw.word}:</strong> {kw.translation}
              </span>
            ))}
          </div>

          {/* Toggle Uzbek Translation */}
          <div className="pt-2">
            <button
              onClick={() => setShowUzbekSummary(!showUzbekSummary)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showUzbekSummary ? 'Hide Uzbek Translation' : 'View Uzbek Translation'}
            </button>
            {showUzbekSummary && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-750 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                {currentPassage.passageUz}
              </p>
            )}
          </div>
        </div>

        {/* Comprehension Questions */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Comprehension Questions</span>
          </h2>

          {currentPassage.questions.map((q, qIdx) => {
            const selected = readingAnswers[qIdx];
            const isChecked = selected !== undefined;

            return (
              <div
                key={qIdx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {qIdx + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    let style =
                      'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-300';

                    if (isChecked) {
                      if (isCorrect) {
                        style =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold';
                      } else if (optIdx === selected) {
                        style =
                          'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 font-bold';
                      }
                    } else if (selected === optIdx) {
                      style = 'border-blue-600 bg-blue-50 text-blue-800 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isChecked}
                        onClick={() => handleSelectReadingAnswer(qIdx, optIdx, q.correctIndex)}
                        className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isChecked && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-750">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      {selected === q.correctIndex ? '✅ Correct!' : '❌ Incorrect!'}
                    </span>
                    <p>{q.explanation}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">🇺🇿 {q.explanationUz}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LISTENING PRACTICE
  // ----------------------------------------------------
  if (mode === 'listening') {
    const currentDialogue = LISTENING_DIALOGUES[selectedDialogueIndex] || LISTENING_DIALOGUES[0];

    const playFullDialogue = async () => {
      if (isPlayingAudio) return;
      setIsPlayingAudio(true);
      for (const line of currentDialogue.dialogueLines) {
        await speakEnglish(`${line.speaker}: ${line.text}`, playbackSpeed);
      }
      setIsPlayingAudio(false);
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 text-xs font-bold mb-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Listening Comprehension</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {currentDialogue.title}
            </h1>
            <p className="text-xs text-slate-400">{currentDialogue.situation}</p>
          </div>

          <div className="flex gap-2">
            {LISTENING_DIALOGUES.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDialogueIndex(idx);
                  setListeningAnswers({});
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDialogueIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Dialogue {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={playFullDialogue}
              disabled={isPlayingAudio}
              className="w-12 h-12 rounded-full bg-white text-violet-700 flex items-center justify-center hover:scale-105 shadow-md transition-all disabled:opacity-50"
            >
              <Play className="w-6 h-6 ml-0.5 fill-violet-700" />
            </button>
            <div>
              <span className="font-bold text-sm block">
                {isPlayingAudio ? 'Playing Dialogue Audio...' : 'Listen to Full Dialogue'}
              </span>
              <span className="text-xs text-violet-200">
                Natural native English speech synthesis
              </span>
            </div>
          </div>

          {/* Playback speed toggle */}
          <div className="flex items-center gap-1.5 bg-white/20 p-1 rounded-xl text-xs font-bold">
            <span className="text-violet-200 text-[11px] px-2">Speed:</span>
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  playbackSpeed === spd ? 'bg-white text-violet-700' : 'text-white hover:bg-white/10'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Dialogue Lines */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Dialogue Transcript:
          </h2>
          <div className="space-y-3">
            {currentDialogue.dialogueLines.map((line, lIdx) => (
              <div
                key={lIdx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                    {line.speaker}:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{line.text}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">🇺🇿 {line.textUz}</p>
                </div>
                <button
                  onClick={() => speakEnglish(line.text, playbackSpeed)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Listening Comprehension Check */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Listening Comprehension Questions
          </h2>
          {currentDialogue.questions.map((q, qIdx) => {
            const selected = listeningAnswers[qIdx];
            const isChecked = selected !== undefined;

            return (
              <div
                key={qIdx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={isChecked}
                      onClick={() => {
                        setListeningAnswers({ ...listeningAnswers, [qIdx]: optIdx });
                        if (optIdx === q.correctIndex) sound.playCorrect();
                        else sound.playIncorrect();
                      }}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${
                        isChecked && optIdx === q.correctIndex
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                          : isChecked && optIdx === selected
                          ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SPEAKING PRACTICE
  // ----------------------------------------------------
  if (mode === 'speaking') {
    const currentPrompt = SPEAKING_PROMPTS[selectedSpeakingIndex] || SPEAKING_PROMPTS[0];

    const startRecording = () => {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Browser microphone speech recognition is not supported on this browser.');
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsRecording(true);
        setRecognizedSpeech('');
        setSpeakingScore(null);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setRecognizedSpeech(text);

        // Simple fuzzy score comparison
        const targetWords = currentPrompt.targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
        const spokenWords = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
        let matches = 0;
        for (const w of spokenWords) {
          if (targetWords.includes(w)) matches++;
        }
        const score = Math.min(100, Math.round((matches / targetWords.length) * 100));
        setSpeakingScore(score);

        if (score >= 70) sound.playCorrect();
        else sound.playIncorrect();
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      rec.start();
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Pronunciation Coach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {currentPrompt.title}
          </h1>
          <p className="text-xs text-slate-500">{currentPrompt.prompt}</p>
        </div>

        {/* Target Sentence Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md text-center space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Target Sentence to Speak:
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 leading-snug">
            "{currentPrompt.targetSentence}"
          </h2>
          <p className="font-mono text-xs text-slate-400">{currentPrompt.phonetic}</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            🇺🇿 {currentPrompt.translationUz}
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => speakEnglish(currentPrompt.targetSentence)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Listen Pronunciation</span>
            </button>

            <button
              onClick={startRecording}
              className={`px-6 py-3 rounded-2xl text-xs font-black text-white shadow-lg transition-all flex items-center gap-2 ${
                isRecording
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/30'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/25'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? 'Listening to your voice...' : 'Press & Speak Now'}</span>
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-[10px] text-slate-400">
            Privacy notice: Your microphone audio is processed locally in your browser.
          </p>

          {/* Results */}
          {recognizedSpeech && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-left space-y-2 animate-in fade-in">
              <span className="text-xs font-bold text-slate-500">What we heard:</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                "{recognizedSpeech}"
              </p>
              {speakingScore !== null && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    Pronunciation Match Score:
                  </span>
                  <span
                    className={`font-black text-sm ${
                      speakingScore >= 70 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {speakingScore}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // WRITING PRACTICE
  // ----------------------------------------------------
  const currentWriting = WRITING_PROMPTS[selectedWritingIndex] || WRITING_PROMPTS[0];
  const wordCount = writingInput.trim() ? writingInput.trim().split(/\s+/).length : 0;

  const handleWritingSubmit = () => {
    if (wordCount < currentWriting.minWords) {
      alert(`Please write at least ${currentWriting.minWords} words before submitting.`);
      return;
    }
    sound.playCorrect();
    setWritingFeedback(
      `Great effort! Your paragraph contains ${wordCount} words. Here are some quick feedback tips: Ensure capital letters at the beginning of each sentence and consistent verb tenses. Well done on practicing!`
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 text-xs font-bold mb-2">
          <PenTool className="w-3.5 h-3.5" />
          <span>Writing & Composition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {currentWriting.title}
        </h1>
        <p className="text-xs text-slate-500">{currentWriting.prompt}</p>
        <p className="text-xs text-slate-400 mt-0.5">🇺🇿 {currentWriting.promptUz}</p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Guiding Questions to help you:
          </span>
          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
            {currentWriting.guidingQuestions.map((gq, i) => (
              <li key={i}>{gq}</li>
            ))}
          </ul>
        </div>

        <textarea
          rows={6}
          value={writingInput}
          onChange={(e) => setWritingInput(e.target.value)}
          placeholder="Start writing your English sentences here..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Words: {wordCount} (Minimum required: {currentWriting.minWords})</span>
          <button
            onClick={handleWritingSubmit}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-fuchsia-600 hover:bg-fuchsia-700 shadow-md flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Review</span>
          </button>
        </div>

        {writingFeedback && (
          <div className="p-4 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-900 text-xs text-fuchsia-900 dark:text-fuchsia-200 space-y-2">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-600" />
              Writing Feedback:
            </span>
            <p>{writingFeedback}</p>
            <div className="pt-2 border-t border-fuchsia-200 dark:border-fuchsia-900 text-[11px] text-slate-500">
              Sample Model: "{currentWriting.sampleAnswer}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
