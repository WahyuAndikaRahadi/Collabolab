import type { TrustLevel, AvailStatus, ProjectCategory, CommitmentLevel, ProjectTopic, ProjectStatus, TaskStatus, Priority, MemberRole } from "@prisma/client";
import "next-auth/jwt";

// ─── NextAuth type augmentation ──────────────────────────────────────────────
declare module "next-auth" {
  interface User {
    id: string;
    trustScore: number;
    trustLevel: TrustLevel;
    availStatus: AvailStatus;
    onboardingDone: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      trustScore: number;
      trustLevel: TrustLevel;
      availStatus: AvailStatus;
      onboardingDone: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    trustScore: number;
    trustLevel: TrustLevel;
    availStatus: AvailStatus;
    onboardingDone: boolean;
  }
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type UserSkillData = {
  id: string;
  skillName: string;
};

export type UserPublicProfile = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  trustScore: number;
  trustLevel: TrustLevel;
  availStatus: AvailStatus;
  isStudentVerified: boolean;
  skills: UserSkillData[];
  createdAt: Date;
};

export type ProjectSkillData = {
  id: string;
  skillName: string;
};

export type ProjectMemberData = {
  id: string;
  userId: string;
  isAnonymous: boolean;
  anonymousTag: string | null;
  revealedAt: Date | null;
  role: MemberRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
    trustScore: number;
    trustLevel: TrustLevel;
  };
};

export type ProjectCardData = {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  commitmentLevel: CommitmentLevel;
  projectTopic: ProjectTopic;
  maxMembers: number;
  status: ProjectStatus;
  deadline: Date | null;
  createdAt: Date;
  requiredSkills: ProjectSkillData[];
  members: { id: string }[];
  owner: {
    id: string;
    name: string;
    image: string | null;
    trustScore: number;
    trustLevel: TrustLevel;
  };
};

export type ProjectDetailData = ProjectCardData & {
  members: ProjectMemberData[];
  tasks: TaskData[];
};

export type TaskData = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  labelTag: string | null;
  deadline: Date | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ChatMessageData = {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  mentions: string[];
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
};

export type ApplicationData = {
  id: string;
  projectId: string;
  applicantId: string;
  message: string;
  commitmentLevel: CommitmentLevel;
  status: string;
  createdAt: Date;
  applicant?: UserPublicProfile;
};

// ─── Category Metadata ────────────────────────────────────────────────────────

export const CATEGORY_META: Record<ProjectCategory, { emoji: string; label: string; color: string }> = {
  LOMBA: { emoji: "🏆", label: "Lomba", color: "#FFE500" },
  STARTUP: { emoji: "💼", label: "Startup", color: "#0047FF" },
  KREATIF: { emoji: "🎨", label: "Kreatif", color: "#FF4D4D" },
  BELAJAR: { emoji: "📚", label: "Belajar", color: "#00D37F" },
  SOSIAL: { emoji: "🌱", label: "Sosial", color: "#00D37F" },
  AKADEMIK: { emoji: "📖", label: "Akademik", color: "#0047FF" },
  BISNIS: { emoji: "📊", label: "Bisnis", color: "#00D37F" },
  PERTANIAN: { emoji: "🚜", label: "Pertanian", color: "#00D37F" },
  TEKNOLOGI: { emoji: "💻", label: "Teknologi", color: "#FFE500" },
  PERKANTORAN: { emoji: "📎", label: "Perkantoran", color: "#FF4D4D" },
};

export const COMMITMENT_META: Record<CommitmentLevel, { label: string; description: string }> = {
  CASUAL: { label: "Casual", description: "Santai, tidak ada tekanan" },
  SERIUS: { label: "Serius", description: "Ada target dan timeline jelas" },
  KOMPETISI: { label: "Kompetisi", description: "Deadline ketat, high commitment" },
};

export const TOPIC_META: Record<ProjectTopic, { label: string; description: string; color: string }> = {
  TEKNOLOGI: { label: "Teknologi", description: "Inovasi & Pengembangan Digital", color: "#0047FF" },
  PERTANIAN: { label: "Pertanian", description: "Ketahanan Pangan & Agrikultur", color: "#00D37F" },
  PENDIDIKAN: { label: "Pendidikan", description: "Pengembangan SDM & Belajar", color: "#FFE500" },
  LINGKUNGAN: { label: "Lingkungan", description: "Sustainability & Alam", color: "#00D37F" },
  EKONOMI: { label: "Ekonomi", description: "Bisnis, Finance & UMKM", color: "#FF4D4D" },
  KARYA_TULIS: { label: "Karya Tulis", description: "Esai, Artikel & Publikasi", color: "#0047FF" },
  RESEARCH: { label: "Research", description: "Penelitian & Analisis Data", color: "#00D37F" },
  PENGABDIAN: { label: "Pengabdian", description: "Sosial & Masyarakat", color: "#FF4D4D" },
  KESEHATAN: { label: "Kesehatan", description: "Wellness & Medis", color: "#00D37F" },
  SENI_BUDAYA: { label: "Seni Budaya", description: "Ekspresi Kreatif & Tradisi", color: "#FFE500" },
};

export const AVAIL_META: Record<AvailStatus, { label: string; color: string; emoji: string }> = {
  OPEN: { label: "Open to Collab", color: "#00D37F", emoji: "🟢" },
  FOCUS: { label: "Fokus Dulu", color: "#FFE500", emoji: "🟡" },
  BUSY: { label: "Sibuk", color: "#FF4D4D", emoji: "🔴" },
};

// ─── Skill Suggestions ────────────────────────────────────────────────────────

export const SKILL_SUGGESTIONS = [
  // Teknologi
  "React", "Next.js", "TypeScript", "Node.js", "Python", "UI/UX Design", "Figma",
  // Akademik & Riset
  "Penulisan Esai", "Karya Tulis Ilmiah", "Analisis Data", "Research", "Metode Penelitian",
  // Bisnis & Perkantoran
  "Business Planning", "Digital Marketing", "Public Speaking", "Microsoft Excel", "Manajemen Proyek", "Copywriting",
  // Pertanian & Lingkungan
  "Urban Farming", "Hidroponik", "Manajemen Lingkungan", "Agroteknologi",
  // Kreatif
  "Video Editing", "Content Creation", "Graphic Design", "Photography", "Storytelling",
  // Soft Skills
  "Leadership", "Negosiasi", "Problem Solving", "Teamwork"
];
