import { GoogleGenerativeAI } from "@google/generative-ai";
import { AITool } from "@prisma/client";

const MODEL_NAME = "gemini-3.1-flash-lite-preview";

export async function callGemini(tool: AITool | string, prompt: string) {
  const rawKeys = [
    process.env.GEMINI_KEY_BRIEF,
    process.env.GEMINI_KEY_GAP,
    process.env.GEMINI_KEY_RECOMMEND,
    process.env.GEMINI_KEY_SUMMARY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ];
  
  const keys = Array.from(new Set(rawKeys.filter(k => k && k !== "YOUR_GEMINI_KEY_HERE"))) as string[];

  if (keys.length === 0) {
    throw new Error(`API key Gemini belum dikonfigurasi di .env.`);
  }

  let lastError = null;

  for (let i = 0; i < keys.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(keys[i]);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      return JSON.parse(text);
    } catch (error: any) {
      console.warn(`[Gemini Fallback] API Key ke-${i + 1} gagal digunakan untuk ${tool}. Pesan: ${error.message}`);
      lastError = error;
      
      if (error instanceof SyntaxError) {
        throw new Error("AI mengembalikan format data yang salah. Silakan coba lagi.");
      }
      
      continue;
    }
  }

  console.error(`[Gemini Fallback] Kritis! Semua ${keys.length} API Keys telah limit/gagal. Error terakhir:`, lastError);
  throw new Error("Semua server AI sedang sibuk (Limit Habis). Silakan tunggu beberapa saat.");
}
