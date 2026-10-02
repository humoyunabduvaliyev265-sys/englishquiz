import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { speakEnglish, sound } from '../services/sound';
import {
  Sparkles,
  Send,
  Trash2,
  Volume2,
  Mic,
  MicOff,
  User,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AITeacherView: React.FC = () => {
  const { user } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-init',
    role: 'assistant',
    content: `👋 Hello ${user?.firstName || 'Student'}! I am your **AI English Teacher**.

I'm here to help you master **CEFR Level ${user?.level || 'A1'}** English!
Feel free to:
• **Ask any grammar question** (e.g., *"When do we use Present Simple?"*)
• **Check your sentences for mistakes** (e.g., *"I goes to school"*)
• **Learn vocabulary with Uzbek translations** (e.g., *"Give me 5 useful words for traveling"*)
• **Practice everyday conversations** in English!

What would you like to learn or practice today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('english_quiz_ai_chat_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [initialGreeting];
  });

  useEffect(() => {
    localStorage.setItem('english_quiz_ai_chat_v1', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Suggested Quick Prompts
  const suggestedPrompts = [
    'Check my sentence: "She don\'t like milk."',
    'Explain the difference between Present Simple and Present Continuous.',
    'How do I use "have got" vs "has got"?',
    'O\'zbekcha: Past Simple zamoni qanday yasaladi?',
    'Teach me 5 useful idioms with examples.',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    sound.playClick();

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          level: user?.level || 'A1',
          language: user?.language || 'en',
          studentName: user?.firstName || 'Student',
        }),
      });

      if (!response.ok) {
        throw new Error('Server responded with error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        role: 'assistant',
        content: data.reply || 'I am ready to help you with English!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      sound.playCorrect();
    } catch {
      // Offline fallback tutor
      const fallbackReply = `Here is your English learning tip for "${text}":\n\nRemember: In English, we always ensure the subject and verb agree. For example, with "I, You, We, They" we use base verbs, while with "He, She, It" we add -s/-es.\n\n🇺🇿 O'zbekcha: Ingliz tili qoidasiga ko'ra ega va fe'l moslashishi zarur.`;
      const assistantMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Browser speech recognition (Speech-to-Text)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your conversation history?')) {
      setMessages([initialGreeting]);
      sound.playClick();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{t('aiTeacherTitle')}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">{t('aiTeacherSub')}</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('clearChat')}</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          {t('suggestedQuestions')}
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(p)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 transition-all text-left shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="h-[480px] overflow-y-auto p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-750 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] ${
                    isUser
                      ? 'text-blue-200 border-t border-blue-500/50'
                      : 'text-slate-400 border-t border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakEnglish(msg.content)}
                        title="Read aloud"
                        className="hover:text-blue-600 transition-colors p-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        title="Copy message"
                        className="hover:text-blue-600 transition-colors p-1"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-.5s]"></div>
              <span className="font-medium text-[11px]">{t('teacherTyping')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        {/* Speech input toggle */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          title={isListening ? 'Stop listening' : 'Speak via microphone'}
          className={`p-3 rounded-2xl border transition-all ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-blue-600 hover:border-blue-400'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isListening ? t('listeningNow') : t('aiTeacherPlaceholder')}
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-40 shadow-md shadow-purple-500/25 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
