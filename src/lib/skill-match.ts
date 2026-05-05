export function calculateSkillMatch(
  userSkills: string[],
  projectRequiredSkills: string[]
): number {
  if (projectRequiredSkills.length === 0) return 100;

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
  const normalizedRequired = projectRequiredSkills.map((s) => s.toLowerCase().trim());

  const matches = normalizedRequired.filter((skill) =>
    normalizedUserSkills.includes(skill)
  );

  return Math.round((matches.length / normalizedRequired.length) * 100);
}

export function getSkillMatchLabel(percentage: number): string {
  if (percentage >= 80) return "Great Match";
  if (percentage >= 60) return "Good Match";
  if (percentage >= 40) return "Partial Match";
  return "Low Match";
}

export function getSkillMatchColor(percentage: number): string {
  if (percentage >= 80) return "#00D37F";
  if (percentage >= 60) return "#FFE500";
  if (percentage >= 40) return "#FF8C00";
  return "#FF4D4D";
}
