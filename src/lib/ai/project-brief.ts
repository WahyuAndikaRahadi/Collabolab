import { callGemini } from "./gemini";

export async function generateProjectBrief(idea: string, category?: string, topicHint?: string, userSkills?: string[]) {
  const prompt = `Kamu adalah AI assistant di CollaboLab, platform kolaborasi untuk Gen-Z Indonesia. 
Platform ini bersifat general, melingkupi berbagai bidang mulai dari Teknologi, Pertanian, Bisnis, Akademik (seperti Esai/Makalah), hingga Sosial.

User ingin membuat project dengan ide berikut:
"${idea}"

${category ? `Kategori yang dipilih: ${category}` : ""}
${topicHint ? `Topik yang relevan: ${topicHint}` : ""}
${userSkills?.length ? `Skill owner: ${userSkills.join(", ")}` : ""}

Buatkan project brief dalam format JSON berikut — HANYA JSON, tidak ada teks lain:
{
  "title": "judul project yang menarik, maks 60 karakter",
  "description": "deskripsi 2-3 kalimat yang jelas dan engaging, maks 250 karakter",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "category": "LOMBA|STARTUP|KREATIF|BELAJAR|SOSIAL|AKADEMIK|BISNIS|PERTANIAN|TEKNOLOGI|PERKANTORAN",
  "commitmentLevel": "CASUAL|SERIUS|KOMPETISI",
  "projectTopic": "TEKNOLOGI|PERTANIAN|PENDIDIKAN|LINGKUNGAN|EKONOMI|KARYA_TULIS|RESEARCH|PENGABDIAN|KESEHATAN|SENI_BUDAYA",
  "topicReasoning": "1 kalimat kenapa project ini relevan dengan topik tersebut"
}`;

  return await callGemini("PROJECT_BRIEF_GENERATOR", prompt);
}
