import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { Subscription } from "@subtrack/db";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface DetectedSubscription {
  serviceName: string;
  amount: number;
  currency: string;
  billingCycle: "weekly" | "monthly" | "yearly" | "custom";
  nextRenewal: string | null;
  category: "ai" | "ott" | "saas" | "cloud" | "productivity" | "other";
}

const DETECTION_PROMPT = (emails: Array<{ from: string; subject: string; date: string }>) => `
You are analyzing email metadata to detect subscription services.

Here are email headers (from, subject, date):
${emails.map((e, i) => `${i + 1}. FROM: ${e.from} | SUBJECT: ${e.subject} | DATE: ${e.date}`).join("\n")}

Extract subscription information and return ONLY a JSON array (no markdown, no explanation):
[
  {
    "serviceName": "Netflix",
    "amount": 799,
    "currency": "INR",
    "billingCycle": "monthly",
    "nextRenewal": "2026-06-15",
    "category": "ott"
  }
]

Rules:
- Only include subscriptions you are confident about
- billingCycle must be one of: weekly, monthly, yearly, custom
- category must be one of: ai, ott, saas, cloud, productivity, other
- nextRenewal should be a future date in YYYY-MM-DD format, or null if unknown
- amount should be a number, 0 if unknown
- Return an empty array [] if no subscriptions detected
`;

export async function detectSubscriptionsWithAI(
  emails: Array<{ from: string; subject: string; date: string }>
): Promise<DetectedSubscription[]> {
  const prompt = DETECTION_PROMPT(emails);

  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as DetectedSubscription[];
  } catch {
    // Fallback to Groq
    try {
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: prompt + "\nRespond with JSON only, no markdown.",
          },
        ],
        temperature: 0.1,
      });
      const text = response.choices[0]?.message?.content || "[]";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? (JSON.parse(jsonMatch[0]) as DetectedSubscription[]) : [];
    } catch {
      return [];
    }
  }
}

export async function generateInsights(subscriptions: Subscription[]) {
  if (subscriptions.length === 0) {
    return [];
  }

  const subSummary = subscriptions
    .map(
      (s) =>
        `${s.serviceName}: ${s.currency} ${s.amount}/${s.billingCycle}, renews ${s.renewalDate.toISOString().split("T")[0]}`
    )
    .join("\n");

  const prompt = `You are a subscription management assistant. Analyze these subscriptions and provide 3-5 actionable insights.

Subscriptions:
${subSummary}

Return ONLY a JSON array of insight objects:
[
  {
    "type": "spend_summary",
    "message": "You spend ₹8,200/month on subscriptions",
    "action": null
  },
  {
    "type": "recommendation",
    "message": "Switching Adobe CC to yearly would save ₹2,400",
    "action": "Consider yearly plan"
  }
]

insight types: spend_summary, category_breakdown, recommendation, anomaly, unused_detection`;

  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch {
    try {
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt + "\nJSON only." }],
        temperature: 0.3,
      });
      const text = response.choices[0]?.message?.content || "[]";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      return [];
    }
  }
}

export async function askSubscriptionQuestion(
  question: string,
  subscriptions: Subscription[]
): Promise<string> {
  const subSummary = subscriptions
    .map(
      (s) =>
        `${s.serviceName}: ${s.currency} ${s.amount}/${s.billingCycle}, category: ${s.category}, renews: ${s.renewalDate.toISOString().split("T")[0]}`
    )
    .join("\n");

  const prompt = `You are a subscription management assistant. Answer the user's question about their subscriptions concisely.

User's subscriptions:
${subSummary}

Question: ${question}

Answer in 1-3 sentences. Be specific with numbers and dates. Today is ${new Date().toISOString().split("T")[0]}.`;

  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    try {
      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
      });
      return response.choices[0]?.message?.content || "I couldn't process that question right now.";
    } catch {
      return "I couldn't process that question right now. Please try again.";
    }
  }
}
