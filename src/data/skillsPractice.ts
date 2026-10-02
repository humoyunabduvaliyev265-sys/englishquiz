import {
  Achievement,
  ListeningDialogue,
  ReadingPassage,
  SpeakingPrompt,
  WritingPrompt,
} from '../types';

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'read-1',
    level: 'A1',
    title: 'A Day in the Life of Anvar',
    titleUz: 'Anvarning bir kuni',
    passage: `Anvar is an eighteen-year-old student living in Tashkent. Every weekday, he wakes up at seven o'clock in the morning. He washes his face, eats a healthy breakfast with his family, and drinks warm green tea. 

At eight o'clock, Anvar takes the clean subway to the university. His favorite subject is English because he wants to become an international software engineer. In the afternoon, Anvar meets his friends at the library to practice grammar and solve quiz questions together. In the evening, he enjoys cycling in the park with his brother before reviewing his vocabulary cards.`,
    passageUz: `Anvar Toshkentda yashovchi 18 yoshli talaba. Har ish kuni u ertalab soat yettida uyg'onadi. U yuzini yuvadi, oilasi bilan birga nonushta qiladi va iliq ko'k choy ichadi.

Soat sakkizda Anvar toza metroda universitetga boradi. Uning sevimli fani ingliz tili, chunki u xalqaro dasturiy injener bo'lishni xohlaydi. Tushdan keyin u kutubxonada do'stlari bilan uchrashib, birgalikda grammatika mashq qiladi va testlar yechadi. Kechqurun esa ukasi bilan bog'da velosiped uchadi va dars takrorlaydi.`,
    keyWords: [
      { word: 'Weekday', translation: 'Ish kuni' },
      { word: 'Healthy', translation: 'Foydali / Sog\'lom' },
      { word: 'Subway', translation: 'Metro' },
      { word: 'Review', translation: 'Takrorlamoq' },
    ],
    questions: [
      {
        question: 'What time does Anvar wake up on weekdays?',
        options: ['At 7:00 AM', 'At 8:00 AM', 'At 6:30 AM', 'At 9:00 AM'],
        correctIndex: 0,
        explanation: 'The passage explicitly says: "Every weekday, he wakes up at seven o\'clock in the morning."',
        explanationUz: 'Matnda: "Every weekday, he wakes up at seven o\'clock in the morning" deb aytilgan.',
      },
      {
        question: 'Why is English Anvar’s favorite subject?',
        options: [
          'He wants to become a software engineer.',
          'He wants to be a history teacher.',
          'His brother told him to learn it.',
          'He lives in England.',
        ],
        correctIndex: 0,
        explanation: 'He wants to become an international software engineer.',
        explanationUz: 'U xalqaro darajadagi dasturchi bo\'lishni xohlaydi.',
      },
    ],
  },
  {
    id: 'read-2',
    level: 'B1',
    title: 'The Silk Road and Modern Tourism',
    titleUz: 'Ipak Yo\'li va zamonaviy turizm',
    passage: `For centuries, the ancient Silk Road served as a vital bridge between the East and the West, facilitating not only the exchange of exquisite silk and precious spices, but also philosophy, scientific discoveries, and languages. 

Today, historic cities like Samarkand, Bukhara, and Khiva attract travelers from all corners of the globe. Visitors admire the stunning turquoise domes, intricate mosaic patterns, and legendary monuments like Registan Square. Tourism has boosted local craftsmanship and created numerous opportunities for multilingual tour guides who speak fluent English.`,
    passageUz: `Asrlar davomida qadimiy Buyuk Ipak Yo\'li Sharq va G\'arb o\'rtasida nafaqat ipak va ziravorlar, balki falsafa, ilmiy kashfiyotlar va tillar almashinuvini ta\'minlovchi ko\'prik bo\'lib xizmat qilgan. Bugungi kunda Samarqand, Buxoro va Xiva butun dunyodan sayyohlarni jalb qilmoqda.`,
    keyWords: [
      { word: 'Exchange', translation: 'Almashinuv' },
      { word: 'Intricate', translation: 'Murakkab / Nafis' },
      { word: 'Multilingual', translation: 'Ko\'p tilli' },
    ],
    questions: [
      {
        question: 'What was exchanged along the Silk Road besides trade goods?',
        options: [
          'Philosophy, science, and languages',
          'Only gold coins',
          'Modern automobiles',
          'Nothing else',
        ],
        correctIndex: 0,
        explanation: 'The passage highlights philosophy, scientific discoveries, and languages.',
        explanationUz: 'Matnda nafaqat mahsulotlar, balki falsafa, ilmiy kashfiyotlar va tillar almashilgani yozilgan.',
      },
    ],
  },
];

export const LISTENING_DIALOGUES: ListeningDialogue[] = [
  {
    id: 'list-1',
    level: 'A1',
    title: 'Ordering at a Cozy Café',
    titleUz: 'Kafeda buyurtma berish',
    situation: 'Humoyun is at an English café ordering morning breakfast.',
    dialogueLines: [
      { speaker: 'Barista', text: 'Good morning! Welcome to Central Coffee. What can I get for you today?', textUz: 'Xayrli tong! Central Coffee ga xush kelibsiz. Sizga nima taklif qilay?' },
      { speaker: 'Humoyun', text: 'Good morning! I would like a hot cappuccino and a fresh croissant, please.', textUz: 'Xayrli tong! Menga bitta issiq kapuchino va yangi kruassan bering, iltimos.' },
      { speaker: 'Barista', text: 'Certainly! Would you like sugar with your coffee?', textUz: 'Albatta! Qahvangizga shakar qo\'shasizmi?' },
      { speaker: 'Humoyun', text: 'No sugar, thank you. How much is that altogether?', textUz: 'Shakarsiz, rahmat. Jami qancha bo\'ldi?' },
      { speaker: 'Barista', text: 'That will be five dollars and fifty cents. Cash or card?', textUz: 'Jami 5 dollar 50 sent. Naqdmi yoki karta?' },
      { speaker: 'Humoyun', text: 'Card, please. Here you go.', textUz: 'Karta orqali, marhamat.' },
    ],
    questions: [
      {
        question: 'What does Humoyun order to drink?',
        options: ['A hot cappuccino', 'A cold soda', 'Green tea', 'Orange juice'],
        correctIndex: 0,
        explanation: 'Humoyun clearly requested: "a hot cappuccino".',
        explanationUz: 'Humoyun "hot cappuccino" (issiq kapuchino) buyurtma qildi.',
      },
      {
        question: 'Does he want sugar in his beverage?',
        options: ['No, without sugar', 'Yes, two spoons', 'Yes, brown sugar', 'Only honey'],
        correctIndex: 0,
        explanation: 'He says: "No sugar, thank you."',
        explanationUz: 'U "No sugar, thank you" deb javob berdi.',
      },
    ],
  },
  {
    id: 'list-2',
    level: 'A2',
    title: 'Asking for Directions in the City',
    titleUz: 'Shaharda yo\'l so\'rash',
    situation: 'A tourist is asking a local police officer for directions to the national museum.',
    dialogueLines: [
      { speaker: 'Tourist', text: 'Excuse me, sir! Could you tell me how to get to the State History Museum?', textUz: 'Kechirasiz! Davlat Tarix Muzeyiga qanday borishni aytib yubora olasizmi?' },
      { speaker: 'Officer', text: 'Of course! Walk straight along this avenue for two blocks, then turn left at the traffic light.', textUz: 'Albatta! Shu ko\'cha bo\'ylab ikkita chorraha to\'g\'ri boring, keyin svetofordan chapga buriling.' },
      { speaker: 'Tourist', text: 'Turn left at the traffic light. Is it far to walk?', textUz: 'Svetofordan chapga. Piyoda uzoqmi?' },
      { speaker: 'Officer', text: 'Not at all. It is only about five minutes away, right next to the city theater.', textUz: 'Mutlaqo yo\'q. Bor-yo\'g\'i besh daqiqalik yo\'l, shahar teatri yonida.' },
      { speaker: 'Tourist', text: 'Thank you very much for your kind help!', textUz: 'Yordamingiz uchun katta rahmat!' },
    ],
    questions: [
      {
        question: 'Where should the tourist turn left?',
        options: ['At the traffic light', 'At the subway entrance', 'At the bridge', 'At the park'],
        correctIndex: 0,
        explanation: 'The officer said: "turn left at the traffic light."',
        explanationUz: 'Svetofordan chapga burilish kerak.',
      },
    ],
  },
];

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'spk-1',
    level: 'A1',
    title: 'Self-Introduction',
    prompt: 'Introduce yourself politely to a new English friend.',
    targetSentence: 'Hello, my name is Humoyun and I am learning English.',
    phonetic: '/həˈləʊ maɪ neɪm ɪz... ænd aɪ æm ˈlɜːnɪŋ ˈɪŋɡlɪʃ/',
    translationUz: 'Salom, mening ismim Humoyun va men ingliz tilini o\'rganyapman.',
    tips: 'Speak clearly and smile. Focus on the smooth link between "name" and "is".',
  },
  {
    id: 'spk-2',
    level: 'A2',
    title: 'Talking About Your Favorite Hobby',
    prompt: 'Describe what you love doing in your free time.',
    targetSentence: 'In my free time, I really enjoy reading interesting books.',
    phonetic: '/ɪn maɪ friː taɪm aɪ ˈrɪəli ɪnˈdʒɔɪ ˈriːdɪŋ ˈɪntrəstɪŋ bʊks/',
    translationUz: 'Bo\'sh vaqtimda qiziqarli kitoblar o\'qishni juda yaxshi ko\'raman.',
    tips: 'Pronounce "interesting" with three syllables: IN-tres-ting.',
  },
  {
    id: 'spk-3',
    level: 'B1',
    title: 'Expressing an Opinion',
    prompt: 'Express why learning languages opens global opportunities.',
    targetSentence: 'In my opinion, mastering English creates tremendous career opportunities.',
    phonetic: '/ɪn maɪ əˈpɪnjən ˈmɑːstərɪŋ ˈɪŋɡlɪʃ kriˈeɪts trəˈmendəs kəˈrɪər ˌɒpəˈtjuːnətiz/',
    translationUz: 'Mening fikrimcha, ingliz tilini egallash ulkan karyera imkoniyatlarini yaratadi.',
    tips: 'Stress the second syllable in "tremendous" (tre-MEN-dous).',
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wrt-1',
    level: 'A1',
    title: 'My Daily Routine',
    prompt: 'Write 3 to 5 sentences describing what you do every day from morning to evening.',
    promptUz: 'Ertalabdan kechgacha qiladigan kundalik ishlaringiz haqida 3-5 ta gap yozing.',
    guidingQuestions: [
      'What time do you get up?',
      'What do you eat for breakfast?',
      'What do you study or work on during the day?',
      'What time do you go to bed?',
    ],
    sampleAnswer: 'Every morning, I wake up at 7:00 AM. I eat fresh bread and drink tea. After that, I study English lessons and practice vocabulary. In the evening, I relax with my family and go to bed at 10:30 PM.',
    minWords: 20,
  },
  {
    id: 'wrt-2',
    level: 'B1',
    title: 'My Dream Travel Destination',
    prompt: 'Describe a city or country you dream of visiting. Explain why you want to travel there and what you plan to see.',
    promptUz: 'Borishni orzu qilgan shahar yoki davlatingiz haqida yozing. Nega u yerga bormoqchisiz va nimalarni ko\'rmoqchisiz?',
    guidingQuestions: [
      'Where is this place located?',
      'What famous sights or landmarks are there?',
      'How will you practice your English there?',
    ],
    sampleAnswer: 'My dream travel destination is London, United Kingdom. I have always wanted to see the historical Big Ben, visit the British Museum, and walk across the Tower Bridge. Visiting London would also give me the perfect opportunity to communicate with native English speakers every day.',
    minWords: 35,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-lesson',
    title: 'First Step to Fluency',
    titleUz: 'Ravonlikka ilk qadam',
    titleRu: 'Первый шаг к свободному языку',
    description: 'Complete your first English lesson.',
    descriptionUz: 'Birinchi ingliz tili darsingizni yakunlang.',
    descriptionRu: 'Пройдите свой первый урок английского языка.',
    icon: 'GraduationCap',
    current: 0,
    max: 1,
    unlocked: false,
    xpReward: 50,
  },
  {
    id: 'ach-first-quiz',
    title: 'Quiz Champion',
    titleUz: 'Test chempioni',
    titleRu: 'Чемпион тестов',
    description: 'Pass your first English quiz with 70%+ score.',
    descriptionUz: 'Birinchi testingizni 70% dan yuqori natija bilan topshiring.',
    descriptionRu: 'Сдайте свой первый тест с результатом выше 70%.',
    icon: 'Award',
    current: 0,
    max: 1,
    unlocked: false,
    xpReward: 100,
  },
  {
    id: 'ach-vocab-50',
    title: 'Word Collector',
    titleUz: 'So\'zlar ustasi',
    titleRu: 'Мастер слов',
    description: 'Learn and memorize 25 English words.',
    descriptionUz: '25 ta yangi inglizcha so\'zni o\'zlashtiring.',
    descriptionRu: 'Выучите 25 новых английских слов.',
    icon: 'BookOpen',
    current: 0,
    max: 25,
    unlocked: false,
    xpReward: 150,
  },
  {
    id: 'ach-streak-3',
    title: 'Consistent Learner',
    titleUz: 'Tirishqoq o\'quvchi',
    titleRu: 'Регулярные занятия',
    description: 'Reach a 3-day active learning streak.',
    descriptionUz: '3 kunlik ketma-ket o\'rganish marrasiga erishing.',
    descriptionRu: 'Достигните серии в 3 активных дня учебы.',
    icon: 'Flame',
    current: 1,
    max: 3,
    unlocked: false,
    xpReward: 120,
  },
  {
    id: 'ach-quiz-master',
    title: 'English Quiz Master',
    titleUz: 'Test ustasi',
    titleRu: 'Мастер квизов',
    description: 'Complete 5 comprehensive English quizzes.',
    descriptionUz: '5 ta to\'liq testni muvaffaqiyatli yakunlang.',
    descriptionRu: 'Завершите 5 полных тестов по английскому языку.',
    icon: 'Trophy',
    current: 0,
    max: 5,
    unlocked: false,
    xpReward: 250,
  },
];
