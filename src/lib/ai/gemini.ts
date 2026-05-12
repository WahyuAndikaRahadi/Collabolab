import { GoogleGenerativeAI } from "@google/generative-ai";
import { AITool } from "@prisma/client";

const MODEL_NAME = "gemini-3.1-flash-lite-preview"; // fallback to latest known if user's specific one fails

export async function callGemini(tool: AITool | string, prompt: string) {
  // Kumpulkan semua API keys yang ada dari env, hilangkan duplikat dan nilai kosong
  const rawKeys = [
    process.env.GEMINI_KEY_BRIEF,
    process.env.GEMINI_KEY_GAP,
    process.env.GEMINI_KEY_RECOMMEND,
    process.env.GEMINI_KEY_SUMMARY,
    process.env.GEMINI_API_KEY_1, // Menampung jika kamu mengubah namanya di env
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ];
  
  const keys = Array.from(new Set(rawKeys.filter(k => k && k !== "YOUR_GEMINI_KEY_HERE"))) as string[];

  if (keys.length === 0) {
    throw new Error(`API key Gemini belum dikonfigurasi di .env.`);
  }

  let lastError = null;

  // Fallback System: Coba API Key satu per satu
  for (let i = 0; i < keys.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(keys[i]);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up JSON if AI wrapped it in markdown
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      return JSON.parse(text);
    } catch (error: any) {
      console.warn(`[Gemini Fallback] API Key ke-${i + 1} gagal digunakan untuk ${tool}. Pesan: ${error.message}`);
      lastError = error;
      
      // Jika gagalnya karena format response bukan JSON yang valid, 
      // jangan pindah key, langsung lempar error agar user coba lagi
      if (error instanceof SyntaxError) {
        throw new Error("AI mengembalikan format data yang salah. Silakan coba lagi.");
      }
      
      // Jika error karena limit (429) atau server down (503), looping akan lanjut ke Key berikutnya
      continue;
    }
  }

  // Jika kode sampai sini, berarti semua key di array sudah dicoba dan gagal semua
  console.error(`[Gemini Fallback] Kritis! Semua ${keys.length} API Keys telah limit/gagal. Error terakhir:`, lastError);
  throw new Error("Semua server AI sedang sibuk (Limit Habis). Silakan tunggu beberapa saat.");
}
