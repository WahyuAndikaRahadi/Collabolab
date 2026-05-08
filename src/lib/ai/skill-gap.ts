
import { callGemini } from "./gemini";

export async function analyzeSkillGap(
  userSkills: string[],
  dnaType: string,
  marketDemand: { skillName: string; count: number }[],
  openProjects: { title: string; skills: string[] }[]
) {
  const prompt = `Kamu adalah growth advisor AI di CollaboLab untuk Gen-Z Indonesia.
Fokus utamamu adalah menjawab pertanyaan user: "Aku kurang apa agar bisa lebih aktif berkolaborasi?"

Data User:
- Skill saat ini: ${userSkills.join(", ") || "Belum ada skill"}
- DNA: ${dnaType}

Kebutuhan Market (berdasarkan project yang sedang open):
${marketDemand.map(s => `- ${s.skillName}: dicari oleh ${s.count} project`).join("\n")}

Tugasmu:
1. Identifikasi 3-5 skill gap paling krusial.
2. Prioritaskan skill yang permintaannya tinggi tapi belum dimiliki user.
3. Berikan saran konkret cara mengisi gap tersebut (misal: "Pelajari TypeScript untuk unlock 15 project startup").

Output format HANYA JSON:
{
  "gaps": [
    {
      "skill": "nama skill",
      "priority": "HIGH|MEDIUM|LOW",
      "demandCount": 0,
      "reasoning": "Kenapa user butuh ini? Contoh: 'Skill ini dicari oleh ${marketDemand[0]?.count || 5} project minggu ini. Dengan menguasai ini, peluangmu diterima naik drastis.'",
      "relevantProjects": ["Contoh project yang butuh skill ini"]
    }
  ],
  "summary": "Analisis singkat 1 kalimat tentang profil skill user."
}`;

  return await callGemini("SKILL_GAP_ANALYZER", prompt);
}
