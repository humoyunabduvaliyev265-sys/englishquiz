import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { InterfaceLanguage, ThemeMode } from '../types';
import { sound } from '../services/sound';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Globe,
  Volume2,
  VolumeX,
  Clock,
  User,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
  Trash2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, updateSettings, logoutUser, showNotification } = useApp();
  const lang = user?.language || 'en';
  const t = (key: any, params?: any) => getTranslation(lang, key, params);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dailyGoalXp, setDailyGoalXp] = useState(user?.dailyGoalXp || 50);
  const [soundEnabled, setSoundEnabled] = useState(user?.soundEnabled ?? true);
  const [timerEnabled, setTimerEnabled] = useState(user?.timerEnabled ?? true);
  const [theme, setTheme] = useState<ThemeMode>(user?.theme || 'light');
  const [selectedLang, setSelectedLang] = useState<InterfaceLanguage>(lang);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      firstName,
      lastName,
      email,
      dailyGoalXp,
      soundEnabled,
      timerEnabled,
      theme,
      language: selectedLang,
    });
    sound.playCorrect();
    showNotification(t('preferencesSaved'), 'success');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all quiz scores and lesson progress? This cannot be undone.'
      )
    ) {
      updateSettings({
        xp: 100,
        completedLessons: [],
        quizHistory: [],
        wordStatuses: {},
        todayXp: 0,
      });
      sound.playClick();
      showNotification('Progress data has been reset to defaults.', 'info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Customize themes, target interface languages, and audio learning options.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Student Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                {t('firstName')}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                {t('lastName')}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Theme Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t('themeSetting')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your favorite visual theme across all pages and quizzes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: t('lightMode'), icon: Sun },
              { id: 'dark', label: t('darkMode'), icon: Moon },
              { id: 'system', label: t('systemMode'), icon: Monitor },
            ].map((th) => {
              const Icon = th.icon;
              const isSel = theme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as ThemeMode)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    isSel
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interface Language Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>{t('languageSetting')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your interface language (English learning materials remain in English).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'en', flag: '🇬🇧', label: 'English' },
              { code: 'uz', flag: '🇺🇿', label: "O'zbek tili" },
              { code: 'ru', flag: '🇷🇺', label: 'Русский' },
            ].map((lg) => {
              const isSel = selectedLang === lg.code;
              return (
                <button
                  key={lg.code}
                  type="button"
                  onClick={() => setSelectedLang(lg.code as InterfaceLanguage)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    isSel
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-2xl">{lg.flag}</span>
                  <span>{lg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio & Quiz Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Interactive Learning Preferences</span>
          </h2>

          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700">
            {/* Sound Effects */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('soundEffects')}
                </span>
                <span className="text-[11px] text-slate-400">{t('soundEffectsSub')}</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Quiz Timer */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('quizTimer')}
                </span>
                <span className="text-[11px] text-slate-400">{t('quizTimerSub')}</span>
              </div>
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Daily Goal */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('dailyGoalSetting')}
                </span>
                <span className="text-[11px] text-slate-400">Target daily points to build streak</span>
              </div>
              <select
                value={dailyGoalXp}
                onChange={(e) => setDailyGoalXp(parseInt(e.target.value, 10))}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value={30}>30 XP (Casual)</option>
                <option value={50}>50 XP (Standard)</option>
                <option value={100}>100 XP (Intense)</option>
                <option value={150}>150 XP (Master)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{t('saveChanges')}</span>
        </button>

        {/* Danger Zone: Reset & Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Learning Progress</span>
          </button>

          <button
            type="button"
            onClick={logoutUser}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
