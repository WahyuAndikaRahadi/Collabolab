
import { callGemini } from "./gemini";

interface AnonymizedReview {
  projectTitle: string;
  projectCategory: string;
  rating: number;
  behaviorTags: string[];
  note: string | null;
}

export async function summarizeReviews(userName: string, dnaType: string, reviews: AnonymizedReview[]) {
  const prompt = `Kamu adalah career coach AI di CollaboLab untuk Gen-Z Indonesia.

Data peer review yang diterima ${userName} (Collaboration DNA: ${dnaType}):

${reviews.map((r, i) => `
Review ${i + 1} — Project: ${r.projectTitle} (${r.projectCategory})
Rating: ${r.rating}/5
Tags: ${r.behaviorTags.join(", ")}
${r.note ? `Catatan: "${r.note}"` : ""}
`).join("\n")}

Buatkan ringkasan yang actionable dalam format JSON — HANYA JSON:
{
  "averageRating": 0.0,
  "strengths": "2-3 kalimat tentang pola kelebihan yang konsisten, spesifik dan berbasis data review",
  "improvements": "2-3 kalimat tentang area yang perlu dikembangkan, jujur tapi konstruktif",
  "recommendation": "1-2 kalimat rekomendasi konkret langkah selanjutnya",
  "topBehaviorTags": [
    { "tag": "nama tag", "count": 0 }
  ]
}`;

  return await callGemini("REVIEW_SUMMARIZER", prompt);
}
