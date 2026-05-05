import type { TrustLevel, AvailStatus, ProjectCategory, CommitmentLevel, SDGTag, ProjectStatus, TaskStatus, Priority, MemberRole } from "@prisma/client";
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
  sdgTag: SDGTag;
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
};

export const COMMITMENT_META: Record<CommitmentLevel, { label: string; description: string }> = {
  CASUAL: { label: "Casual", description: "Santai, tidak ada tekanan" },
  SERIUS: { label: "Serius", description: "Ada target dan timeline jelas" },
  KOMPETISI: { label: "Kompetisi", description: "Deadline ketat, high commitment" },
};

export const SDG_META: Record<SDGTag, { label: string; description: string; color: string }> = {
  SDG8: { label: "SDG 8", description: "Decent Work & Economic Growth", color: "#A21942" },
  SDG9: { label: "SDG 9", description: "Industry, Innovation & Infrastructure", color: "#FD6925" },
  SDG12: { label: "SDG 12", description: "Responsible Consumption & Production", color: "#BF8B2E" },
};

export const AVAIL_META: Record<AvailStatus, { label: string; color: string; emoji: string }> = {
  OPEN: { label: "Open to Collab", color: "#00D37F", emoji: "🟢" },
  FOCUS: { label: "Fokus Dulu", color: "#FFE500", emoji: "🟡" },
  BUSY: { label: "Sibuk", color: "#FF4D4D", emoji: "🔴" },
};

// ─── Skill Suggestions ────────────────────────────────────────────────────────

export const SKILL_SUGGESTIONS = [
  // Frontend
  "React", "Next.js", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS",
  // Backend
  "Node.js", "Express.js", "FastAPI", "Django", "Laravel", "Spring Boot", "Go",
  // Mobile
  "React Native", "Flutter", "Swift", "Kotlin",
  // Design
  "UI/UX Design", "Figma", "Adobe XD", "Canva", "Illustrator", "Photoshop",
  // Data
  "Python", "Machine Learning", "Data Analysis", "TensorFlow", "PyTorch",
  // Database
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase",
  // DevOps
  "Docker", "Kubernetes", "CI/CD", "AWS", "GCP", "Vercel",
  // Soft Skills
  "Project Management", "Content Writing", "Marketing", "Business Analysis",
  "Video Editing", "3D Modeling", "Game Development",
];
