import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_COMMUNITIES, INITIAL_WORKSHOPS } from '@/lib/data';
import { getFastCampusAnswer } from '@/lib/aiFastResponses';

// High-speed in-memory cache for fast repeated queries
const memoryCache = new Map<string, string>();
const MAX_CACHE_SIZE = 300;

function addToCache(key: string, val: string) {
  if (memoryCache.size >= MAX_CACHE_SIZE) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, val);
}

// Compact campus database context (curated for minimal token overhead & fastest TTFT)
const COMPACT_COMMUNITY_SUMMARY = INITIAL_COMMUNITIES.map(
  (c) => `${c.shortCode} (${c.name}): Lead ${c.leadName} (${c.leadRole}). Focus: ${c.category}, ${c.tags.slice(0, 3).join(', ')}. Details: ${c.detailedInfo}`
).join('\n');

const COMPACT_WORKSHOP_SUMMARY = INITIAL_WORKSHOPS.map(
  (w) => `${w.title} (${w.communityName}): ${w.date}, ${w.time} @ ${w.venue}. Seats: ${w.seatsLeft}/${w.seatsTotal}. Pre-req: ${w.prerequisites}`
).join('\n');

function buildFallbackAnswer(branch: string, question: string): string {
  const q = question.toLowerCase();
  if (q.includes('club') || q.includes('join')) {
    return `**Recommended Clubs for ${branch}:**\n\n• **GDSC (Google Developer Student Club)**: Modern web development, cloud deployment, and team hackathons.\n• **ACM Student Chapter**: Data structures, algorithms (DSA), and ICPC coding rounds.\n• **Robotics Society (RAS)**: Microcontrollers (ESP32/Arduino) and embedded hardware.\n\n*Browse communities & RSVP for upcoming workshops in the **Explore** tab!*`;
  }
  if (q.includes('workshop') || q.includes('event')) {
    return `**Upcoming Campus Events:**\n\n• **Autonomous Robotics Workshop** (RAS) — Oct 10 @ Robotics Lab 204\n• **Full-Stack Cloud & Web Apps** (GDSC) — Oct 14 @ Seminar Hall 2\n• **ICPC Problem Solving Primer** (ACM) — Oct 19 @ Lab 101\n\n*Check the **Explore** tab to reserve your seat!*`;
  }
  return `**Campus AI Guidance (${branch}):**\n\n• **Top Technical Clubs**: Connect with **GDSC** for cloud/web, **ACM** for algorithms, and **RAS** for hardware.\n• **Upcoming Action**: Register for the upcoming *Autonomous Robotics* or *Full-Stack Cloud* bootcamps.\n• **Mentorship**: Reach out directly to senior leads like Rohan Deshmukh or Aditya Mehta in the **Messages** tab!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, studentProfile } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    const normKey = trimmedQuestion.toLowerCase();
    const branch = studentProfile?.branch || 'Computer Engineering';

    // 1. Check in-memory cache first (0ms latency)
    if (memoryCache.has(normKey)) {
      const cached = memoryCache.get(normKey)!;
      return NextResponse.json({ reply: cached, source: 'cache' });
    }

    // 2. High-speed local campus intent match (0ms latency)
    const fastMatch = getFastCampusAnswer(trimmedQuestion, studentProfile);
    if (fastMatch.matched) {
      addToCache(normKey, fastMatch.reply);
      return NextResponse.json({ reply: fastMatch.reply, source: 'fast-knowledge' });
    }

    // 3. Prepare robust fallback answer
    const fallback = buildFallbackAnswer(branch, trimmedQuestion);

    // 4. Gemini API Call with 3.5s timeout race
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are CampusPulse AI Advisor, the official lightning-fast student guide for college campus committees, technical workshops, and junior onboarding.
Keep your response ultra-efficient:
1. MAX 70-85 words.
2. Directly answer with high-impact bullet points and bold headers.
3. Tailor recommendations specifically to the student's branch (${branch}).
4. Mention relevant clubs, leads, or upcoming workshops where applicable.
5. NO greeting fluff, NO polite preamble, NO repetitive disclaimers.

VERIFIED CAMPUS DATA:
${COMPACT_COMMUNITY_SUMMARY}

UPCOMING WORKSHOPS:
${COMPACT_WORKSHOP_SUMMARY}`;

      // Race between Gemini API call and a 3500ms safety timeout
      const apiCall = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: trimmedQuestion,
        config: {
          systemInstruction,
          temperature: 0.3,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        },
      });

      const timeoutPromise = new Promise<{ text: string }>((resolve) => {
        setTimeout(() => {
          resolve({ text: fallback });
        }, 3500);
      });

      const result = await Promise.race([apiCall, timeoutPromise]);
      const reply = result.text || fallback;

      addToCache(normKey, reply);
      return NextResponse.json({ reply, source: 'gemini-flash' });
    }

    // No API key configured
    addToCache(normKey, fallback);
    return NextResponse.json({ reply: fallback, source: 'fallback' });
  } catch (error: any) {
    console.error('Error generating AI query response:', error);
    const fallback = buildFallbackAnswer('Computer Engineering', 'general');
    return NextResponse.json({ reply: fallback, error: true }, { status: 200 });
  }
}
