
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AITool } from "@prisma/client";

const MODEL_NAME = "gemini-3.1-flash-lite-preview"; // fallback to latest known if user's specific one fails

function getApiKey(tool: AITool): string {
  switch (tool) {
    case "PROJECT_BRIEF_GENERATOR":
      return process.env.GEMINI_KEY_BRIEF || "";
    case "SKILL_GAP_ANALYZER":
      return process.env.GEMINI_KEY_GAP || "";
    case "PROJECT_RECOMMENDATION":
      return process.env.GEMINI_KEY_RECOMMEND || "";
    case "REVIEW_SUMMARIZER":
      return process.env.GEMINI_KEY_SUMMARY || "";
    default:
      return "";
  }
}

export async function callGemini(tool: AITool, prompt: string) {
  const apiKey = getApiKey(tool);
  if (!apiKey || apiKey === "YOUR_GEMINI_KEY_HERE") {
    throw new Error(`API key for ${tool} is not configured.`);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up JSON if AI wrapped it in markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error(`Gemini Error (${tool}):`, error);
    throw new Error("Gagal berkomunikasi dengan AI. Silakan coba lagi nanti.");
  }
}
