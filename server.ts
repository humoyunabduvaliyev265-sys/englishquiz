import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Teacher chat endpoint
  app.post('/api/ai-teacher', async (req, res) => {
    try {
      const {
        message,
        conversationHistory = [],
        level = 'A1',
        language = 'en',
        studentName = 'Student',
      } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // If Gemini client is available, query real model
      if (ai) {
        const systemInstruction = `You are "AI Teacher", a friendly, patient, and highly effective English tutor on the "ENGLISH QUIZ" platform.
The student's name is ${studentName}.
Current CEFR level: ${level} (A1=Beginner, A2=Elementary, B1=Intermediate, B2=Upper Intermediate, C1=Advanced, C2=Proficient).
Selected preferred interface language: ${language === 'uz' ? 'Uzbek (O\'zbekcha)' : language === 'ru' ? 'Russian (Русский)' : 'English'}.

Your teaching objectives:
1. Explain English grammar clearly, using vocabulary and sentence structures appropriate for level ${level}.
2. Whenever the student writes a sentence with grammatical, spelling, or vocabulary mistakes, gently highlight the mistake, give the corrected sentence, and explain WHY in simple terms.
   Example pattern:
   "The correct sentence is: '...'
   Rule: We use ... with ...
   O'zbekcha / Russian izoh (if applicable): ..."
3. Provide examples in English, and when requested or helpful (especially for A1, A2, and Uzbek learners), provide clear Uzbek (O'zbek tili) translations and explanations.
4. Keep answers encouraging, structured with bullet points or bold highlights, and conclude with a quick mini-practice question or encouragement.
5. If the student asks about a quiz or test question, explain the underlying rule and meaning clearly without just giving raw answers blindly.
6. Tone: Warm, professional, educational, motivating.`;

        // Format history
        const contents: any[] = [];
        if (Array.isArray(conversationHistory)) {
          for (const item of conversationHistory.slice(-8)) {
            contents.push({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: item.content }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || 'I am ready to help you with English! Could you rephrase your question?';
        return res.json({ reply, source: 'gemini' });
      }

      // Intelligent Fallback Teacher Mode if API key is not yet configured
      const lower = message.toLowerCase().trim();
      let fallbackReply = '';

      if (lower.includes('i goes') || lower.includes('he go') || lower.includes('they goes')) {
        fallbackReply = `👋 Hello ${studentName}! Here is your grammar correction:

❌ Incorrect: "${message}"
✅ Correct: "I go to school." (or "He goes to school.")

📖 **Grammar Rule (Present Simple):**
• With **I, You, We, They**, use the base verb: *I go, We learn, They play*.
• With **He, She, It**, add **-s / -es**: *He goes, She learns, It plays*.

🇺🇿 **O'zbekcha tushuntirish:**
"I" (Men) olmoshi bilan fe'l o'zgarmaydi (*I go*). "He/She/It" (U) bilan esa fe'lga **-s/-es** qo'shiladi (*He goes*).

🎯 **Mini mashq:** Can you make a sentence with "She" and "read"?`;
      } else if (lower.includes('present simple') || lower.includes('hozirgi')) {
        fallbackReply = `📚 **Present Simple Tense (Oddiy hozirgi zamon)**

**When do we use it?**
1. Habits and daily routines (e.g. *I drink tea every morning.*)
2. General truths and facts (e.g. *The sun rises in the east.*)

**Structure:**
• **Positive:** Subject + Verb (add -s/-es for he/she/it)
  *Example:* I work / She works.
• **Negative:** Subject + do not (don't) / does not (doesn't) + Verb
  *Example:* I don't like coffee / He doesn't like tea.
• **Question:** Do / Does + Subject + Verb?
  *Example:* Do you speak English? Yes, I do!

🇺🇿 **O'zbekcha:**
Muntazam takrorlanadigan odatiy ish-harakatlar uchun ishlatiladi.
Savol berishda **Do / Does** yordamchi fe'llari ishlatiladi.`;
      } else if (lower.includes('to be') || lower.includes('am is are')) {
        fallbackReply = `📘 **The Verb "TO BE" (Am, Is, Are)**

• **I** -> am (*I am a student.*)
• **He / She / It** -> is (*He is a teacher. She is happy.*)
• **You / We / They** -> are (*We are learning English.*)

🇺🇿 **O'zbekcha:**
"To be" fe'li "bo'lmoq" ma'nosini bildiradi va shaxsga qarab am/is/are shakllariga o'zgaradi.
Misol: *I am Humoyun* -> Men Humoyunman.`;
      } else {
        fallbackReply = `👋 Hello ${studentName}! Welcome to your AI English Teacher.

I am here to help you master level **${level}** English!
You can ask me to:
1. **Explain any grammar topic** (e.g. "Explain Past Simple", "Difference between Have and Has")
2. **Check your sentences for mistakes** (e.g. "Is this correct: She don't like milk?")
3. **Teach vocabulary with examples & Uzbek translations** (e.g. "10 travel words in English & Uzbek")
4. **Practice conversations and dialogs** for everyday situations.

What would you like to practice today?`;
      }

      return res.json({
        reply: fallbackReply,
        source: 'local-teacher',
      });
    } catch (err: any) {
      console.error('AI Teacher error:', err);
      return res.status(500).json({
        error: 'Failed to generate teacher response',
        details: err.message,
      });
    }
  });

  // In production serve dist, in dev mount Vite middleware
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
  process.exit(1);
});
