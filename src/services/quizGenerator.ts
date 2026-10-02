import { CEFRLevel, QuizConfig, QuizQuestion } from '../types';
import { MASTER_QUIZ_QUESTIONS } from '../data/quizBank';

export function generateQuizQuestions(config: QuizConfig): QuizQuestion[] {
  const { questionCount, difficulty, level, topicId } = config;

  // 1. Filter by level / difficulty / topic if specified
  let pool = MASTER_QUIZ_QUESTIONS.filter((q) => {
    if (topicId && q.topicId !== topicId) return false;
    if (level && level !== 'A1' && q.level !== level && !topicId) {
      // In mixed level or general quiz, we prioritize target level or adjacent
    }
    if (difficulty !== 'mixed' && q.difficulty !== difficulty) {
      return false;
    }
    return true;
  });

  // If filtered pool is smaller than required, broaden pool
  if (pool.length < questionCount) {
    // Add same level all difficulties
    const sameLevel = MASTER_QUIZ_QUESTIONS.filter((q) => q.level === level);
    for (const q of sameLevel) {
      if (!pool.find((p) => p.id === q.id)) pool.push(q);
    }
  }

  // If still smaller, add questions from other levels
  if (pool.length < questionCount) {
    for (const q of MASTER_QUIZ_QUESTIONS) {
      if (!pool.find((p) => p.id === q.id)) pool.push(q);
    }
  }

  // Shuffle pool using Fisher-Yates
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // If questionCount is greater than available unique master questions (e.g. 50 requested),
  // dynamically generate structured questions based on educational patterns:
  const result: QuizQuestion[] = [];
  const usedTexts = new Set<string>();

  for (const q of shuffled) {
    if (result.length >= questionCount) break;
    if (!usedTexts.has(q.question)) {
      result.push({ ...q });
      usedTexts.add(q.question);
    }
  }

  // If more questions needed to hit exact count (20, 25, 30, 40, or 50):
  if (result.length < questionCount) {
    const dynamicTemplates: {
      template: (i: number) => QuizQuestion;
    }[] = [
      {
        template: (i) => ({
          id: `dyn-num-${i}`,
          level: 'A1',
          topicId: 'a1-numbers',
          topicTitle: 'Numbers',
          difficulty: 'easy',
          question: `What is the English word for the number ${10 + i}?`,
          options: [
            ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-one', 'Twenty-two', 'Twenty-three', 'Twenty-four', 'Twenty-five', 'Twenty-six', 'Twenty-seven', 'Twenty-eight', 'Twenty-nine', 'Thirty'][i % 21],
            'Fifty',
            'Seven',
            'Forty',
          ],
          correctIndex: 0,
          explanation: `Number ${10 + i} is spelled and pronounced in English accordingly.`,
          explanationUz: `${10 + i} soni ingliz tilida shunday aytiladi va yoziladi.`,
        }),
      },
      {
        template: (i) => {
          const subjects = ['She', 'He', 'My teacher', 'The doctor', 'Humoyun'];
          const verbs = ['studies', 'works', 'speaks', 'writes', 'learns'];
          const s = subjects[i % subjects.length];
          const v = verbs[i % verbs.length];
          return {
            id: `dyn-pres-${i}`,
            level: 'A2',
            topicId: 'a2-grammar',
            topicTitle: 'Subject-Verb Agreement',
            difficulty: 'medium',
            question: `${s} ___ English very diligently every single day.`,
            options: [v, v.replace(/s$/, ''), v + 'ing', 'is ' + v],
            correctIndex: 0,
            explanation: `Third-person singular in Present Simple takes the "-s" or "-es" suffix.`,
            explanationUz: `Uchinchi shaxs birlik (he/she) bilan fe'lga "-s" qo'shiladi: ${v}.`,
          };
        },
      },
      {
        template: (i) => {
          const words = [
            { w: 'reliable', s: 'dependable', a: 'untrustworthy' },
            { w: 'diligent', s: 'hardworking', a: 'lazy' },
            { w: 'enormous', s: 'huge', a: 'tiny' },
            { w: 'rapid', s: 'fast', a: 'slow' },
            { w: 'valuable', s: 'precious', a: 'worthless' },
            { w: 'courageous', s: 'brave', a: 'cowardly' },
          ];
          const item = words[i % words.length];
          return {
            id: `dyn-syn-${i}`,
            level: 'B1',
            topicId: 'b1-vocab',
            topicTitle: 'Synonyms & Vocabulary',
            difficulty: 'medium',
            question: `Which word is the closest synonym for "${item.w}"?`,
            options: [item.s, item.a, 'unrelated', 'opposite'],
            correctIndex: 0,
            explanation: `"${item.w}" and "${item.s}" have identical or very similar definitions.`,
            explanationUz: `"${item.w}" so'zining eng yaqin ma'nodosh sinonomi — "${item.s}".`,
          };
        },
      },
      {
        template: (i) => {
          const prepItems = [
            { s: 'She is fond ___ classical music.', a: 'of', dist: ['with', 'in', 'at'] },
            { s: 'They succeeded ___ passing the examination.', a: 'in', dist: ['at', 'on', 'with'] },
            { s: 'He apologized ___ being late.', a: 'for', dist: ['to', 'with', 'about'] },
            { s: 'Are you satisfied ___ your test results?', a: 'with', dist: ['of', 'for', 'about'] },
            { s: 'The book consists ___ twelve chapters.', a: 'of', dist: ['in', 'from', 'by'] },
          ];
          const item = prepItems[i % prepItems.length];
          return {
            id: `dyn-prep-${i}`,
            level: 'B2',
            topicId: 'b2-prepositions',
            topicTitle: 'Dependent Prepositions',
            difficulty: 'hard',
            question: item.s,
            options: [item.a, item.dist[0], item.dist[1], item.dist[2]],
            correctIndex: 0,
            explanation: `Standard dependent preposition rule.`,
            explanationUz: `Ingliz tilida bu so'z birikmasi bilan aynan "${item.a}" predlogi ishlatiladi.`,
          };
        },
      },
    ];

    let dynIdx = 0;
    while (result.length < questionCount) {
      const t = dynamicTemplates[dynIdx % dynamicTemplates.length];
      const dynQ = t.template(dynIdx);
      if (!usedTexts.has(dynQ.question)) {
        result.push(dynQ);
        usedTexts.add(dynQ.question);
      }
      dynIdx++;
    }
  }

  // Shuffle each question's 4 options and update correctIndex accordingly
  // so the correct answer is not always at position 0!
  return result.slice(0, questionCount).map((q, idx) => {
    const rawOptions = [...q.options];
    const correctValue = rawOptions[q.correctIndex];
    // Fisher-Yates options
    for (let i = rawOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
    }
    const newCorrectIndex = rawOptions.indexOf(correctValue);
    return {
      ...q,
      id: `${q.id}-${idx}`,
      options: rawOptions,
      correctIndex: newCorrectIndex,
    };
  });
}
