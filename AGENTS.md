<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

CollaboLab 🤝
Find Your People. Build Together.

Platform kolaborasi real-time untuk Gen-Z — menghubungkan siswa dan mahasiswa untuk berkolaborasi dalam project, lomba, komunitas kreatif, dan lainnya. Dibangun dengan sistem reputasi berbasis kepercayaan untuk menjaga ekosistem yang sehat dan inklusif.


🎯 Konteks Lomba
Event: SEFEST 2026 — Software Engineering Festival
Penyelenggara: HIMSE Telkom University Surabaya
Tema: "Gen-Z TechPreneur: Digital Solutions for a Sustainable Future"
SDG yang diangkat: SDG 8 (Decent Work and Economic Growth) & SDG 9 (Industry, Innovation and Infrastructure)
Kategori Lomba: Web Design
Relevansi SDG
CollaboLab menjawab SDG 8 dengan memfasilitasi ekosistem kerja kolaboratif yang inklusif bagi generasi muda, membuka peluang produktif tanpa batasan institusi. Relevansi SDG 9 tercermin dari infrastruktur digital inovatif yang dibangun untuk mendukung inovasi berbasis komunitas.

💡 Problem Statement
Gen-Z dikenal sebagai generasi yang terhubung secara digital, namun paradoks justru terjadi — mereka cenderung introvert dan kesulitan membangun kolaborasi nyata. Akibatnya:

Banyak ide project dan lomba terbengkalai karena tidak ada tim
Komunitas online mudah dipenuhi spam, ghost member, dan akun tidak bertanggung jawab
Tidak ada platform terpusat yang mempertemukan orang berdasarkan skill, bukan hanya pertemanan
Gen-Z yang baru mulai tidak punya portofolio, sehingga kesulitan masuk ke ekosistem kolaborasi

CollaboLab hadir sebagai solusi — bukan hanya platform cari tim, tapi ekosistem kolaborasi yang sehat dengan sistem reputasi yang mendorong akuntabilitas dan membangun kepercayaan secara organik.

🖥️ Landing Page
Landing page adalah pintu masuk pertama sekaligus alat konversi utama CollaboLab. Tujuannya bukan menjelaskan semua fitur, melainkan satu hal saja: membuat visitor yakin untuk klik daftar. Tidak ada login yang diperlukan untuk melihat landing page secara penuh.
Struktur Halaman
1. Hero Section
Blok pertama yang dilihat visitor. Berisi tagline utama yang langsung menyentuh masalah Gen-Z, sub-tagline singkat yang menjelaskan solusi, dan dua CTA: tombol primer "Mulai Gratis" (kuning #FFE500, neobrutalism style) dan tombol sekunder "Lihat Project". Di background ada elemen dekoratif geometris yang mencerminkan estetika neobrutalism — bukan ilustrasi kompleks, cukup bentuk-bentuk bold yang menambah karakter.
2. Why CollaboLab
Tiga pain point Gen-Z yang dikemas sebagai card horizontal dengan ikon besar:

"Punya ide tapi tidak ada tim?" — masalah cari partner
"Susah mulai kenalan online?" — masalah introvert
"Komunitas penuh spam & ghost?" — masalah kepercayaan

Setiap card langsung menyebut solusinya dalam satu kalimat. Visitor yang relate langsung merasa platform ini dibuat untuk mereka.
3. How It Works
Tiga langkah visual yang sangat singkat, ditampilkan sebagai numbered steps besar:

Buat profil & isi skill tags
Temukan project yang cocok
Kolaborasi di Collab Room

Tidak boleh lebih dari tiga langkah — tujuannya menghilangkan rasa takut bahwa platform ini ribet, bukan memberikan tutorial.
4. Explore Preview (tanpa login)
Empat project card sungguhan dari database ditampilkan secara publik. Setiap card menampilkan judul project, kategori dengan icon, skill yang dibutuhkan, dan Trust Score owner. Visitor bisa merasakan isi platform sebelum memutuskan daftar. Ini mengurangi anxiety "nanti isinya apa?" yang sering jadi alasan orang tidak mau mendaftar. Di bawah preview ada tombol "Lihat Semua Project →" yang redirect ke /explore (perlu login).
5. Trust & Community Section
Penjelasan singkat tentang sistem Trust Score dan Anonymous Mode — dua fitur yang paling membedakan CollaboLab dari platform lain. Ditampilkan sebagai dua kolom dengan ilustrasi sederhana berbasis shape neobrutalism.
6. CTA Penutup
Di paling bawah, satu CTA besar lagi dengan background warna accent — karena banyak visitor yang scroll sampai bawah sebelum memutuskan. Teks: "Siap kolaborasi? Daftar gratis sekarang."
Komponen Landing Page
components/landing/
├── HeroSection.tsx          # Tagline + dual CTA + dekorasi geometris
├── WhySection.tsx           # 3 pain point cards
├── HowItWorksSection.tsx    # 3 numbered steps
├── ExplorePreview.tsx       # 4 project cards publik (server component)
├── TrustSection.tsx         # Trust Score + Anonymous Mode highlight
└── CtaFooterSection.tsx     # CTA penutup
Konten yang Tampil Tanpa Login

Seluruh landing page
4 project card di Explore Preview (read-only, tanpa skill match %)
Halaman /explore hanya menampilkan daftar project tanpa fitur apply


✨ Fitur Utama
🔐 Auth & Onboarding

Registrasi minimal (nama, email, password) — anti drop-off
Verifikasi email sebagai layer pertama anti-spam
Onboarding 3-step progresif:

Pilih skill tags (minimal 3, UI chip-based bukan dropdown)
Isi bio singkat dengan placeholder friendly
Opsional: tambah LinkedIn / portfolio / GitHub untuk boost Trust Score


Trust Score awal langsung ditetapkan setelah onboarding selesai
Availability Status: Open to Collab / Fokus Dulu / Sibuk

🏅 Trust Score & Reputasi
Sistem reputasi multi-layer yang menjaga kualitas komunitas:
Kalkulasi Trust Score (0–100):

Kolaborasi project selesai: +15
Review bintang 4–5 dari rekan: +10
Profile lengkap & verified: +10
Aktif tanpa laporan: +2/minggu
LinkedIn/portfolio terverifikasi: +8
Verifikasi pelajar (KTM/kartu pelajar): +10 + badge "Verified Student"
Di-report & terbukti: -20
No-show / ghost dari project: -10
Di-kick dari project: -8

Level berdasarkan score:
ScoreLevelAkses0–30🔴 NewcomerHanya bisa apply31–60🟡 MemberBisa buat project (maks 2 aktif)61–85🟢 TrustedFull akses, bisa invite langsung86–100🔵 VerifiedBadge khusus, prioritas di feed
🔍 Explore & Discovery Feed

Feed project dengan kategori visual: 🏆 Lomba · 💼 Startup · 🎨 Kreatif · 📚 Belajar · 🌱 Sosial
Skill Match Indicator — setiap project card menampilkan persentase kecocokan skill user dengan yang dibutuhkan project (contoh: "85% match — kamu punya 3 dari 4 skill yang dicari")
Filter berdasarkan kategori, skill, commitment level, dan status
Bookmark project untuk disimpan dan dilihat nanti
Explore preview tersedia tanpa login (teaser 4 project)

📋 Project Management

Project Brief Template berbasis kategori — pilih "Lomba Hackathon" maka field otomatis menyesuaikan (nama lomba, deadline, link briefing, skill dibutuhkan)
Commitment level: Casual / Serius / Kompetisi
Project Progress Bar otomatis berdasarkan persentase task Done di kanban
Maksimal slot anggota yang bisa diatur owner
Status project: Open / In Progress / Completed / Archived

📝 Apply & Review System

Form apply minimalis: pesan singkat + konfirmasi commitment level
Owner menerima notifikasi real-time saat ada applicant baru
Panel review applicant: profil lengkap + skill tags + Trust Score
Rejection bersifat gentle — tidak ada penalti Trust Score untuk applicant
Notifikasi keputusan real-time via Pusher

🕵️ Anonymous Ice-Breaker Mode
Fitur unik untuk pengguna introvert:

User bisa join project dengan username anonim
Reveal identitas asli kapanpun mereka siap (atau otomatis setelah 3 hari)
Field is_anonymous dan revealed_at di tabel project members
Di dalam Collab Room, nama ditampilkan sebagai "Anon#[4digit]" hingga reveal

🏠 Collab Room (Real-time)
Ruang kolaborasi per-project dengan tiga fitur utama berjalan bersamaan:
Live Chat

Pesan masuk real-time via Pusher Channels
@mention anggota dengan notifikasi langsung
Riwayat chat tersimpan di NeonDB

Kanban Board

Kolom: To Do · In Progress · Done
Drag-and-drop card dengan sync real-time ke semua anggota via Pusher
Task card berisi: judul, assignee, label kategori, deadline, priority indicator
Batas maksimal 3 task per orang di In Progress (anti-overcommit)
Activity log: riwayat pergerakan task
Auto-archive task Done setelah 7 hari

Presence Indicator

Avatar anggota yang sedang online ditampilkan real-time
Status: Online · Away · Offline
Indikator konflik saat dua anggota edit task yang sama

Quick Poll

Owner buat polling singkat di dalam room
Anggota vote real-time, hasil langsung terupdate via Pusher
Contoh: "Kita pakai Figma atau Adobe XD?"

⭐ Peer Review & Skill Endorsement

Setelah project selesai, semua anggota wajib review satu sama lain
Rating 1–5 bintang
Tag behavior: Komunikatif / Tepat Waktu / Helpful / Ghosted / Toxic
Review anonim di mata sesama anggota, tercatat di sistem
Skill Endorsement — endorse skill spesifik rekan setelah kolaborasi: React ⚡ ×4 / UI Design 🎨 ×2
Akumulasi endorsement tampil di profil publik

📧 Notifikasi Email (via Resend)

Email verifikasi akun
Notifikasi apply diterima / ditolak
Reminder project mendekati deadline
Digest mingguan: project baru yang cocok dengan skill user
Email peer review setelah project selesai

🛡️ Anti-Spam & Moderation

Cooldown post project 48 jam untuk Newcomer
Deteksi duplikasi konten (title + deskripsi mirip = flagged)
Report system dengan tiga tier severity (ringan / sedang / berat)
Auto-hide konten yang dilaporkan banyak user
Volunteer Moderator: user Trust Score 80+ bisa apply jadi mod


🎨 Design System — Neobrutalism
CollaboLab menggunakan estetika Neobrutalism yang bold, kontras, dan identik dengan Gen-Z. Pilihan ini bukan sekadar estetika — ini adalah pernyataan identitas yang membedakan platform dari kompetitor yang mayoritas menggunakan desain clean/minimal.
Prinsip Desain

Border tebal hitam (2–3px solid #000000) pada semua card, button, dan container
Box shadow offset — 4px 4px 0px #000000 sebagai elemen signature
Hover effect — elemen "bergeser" saat hover: shadow menjadi 2px 2px 0px #000 dan elemen translate 2px 2px
Warna solid berani — tidak ada gradient, tidak ada blur, tidak ada shadow halus
Typography bold — heading menggunakan weight 800–900
Layout asymmetric — grid tidak selalu rapi, ada elemen yang "keluar" dari grid untuk kesan dinamis

Color Palette
Primary Background : #FFFFFF (putih bersih)
Secondary Surface  : #F5F0E8 (krem hangat)
Accent Yellow      : #FFE500 (kuning neon — CTA utama)
Accent Green       : #00D37F (hijau mint — success/trust)
Accent Coral       : #FF4D4D (merah coral — warning/danger)
Accent Blue        : #0047FF (biru royal — info/link)
Text Primary       : #000000 (hitam pekat)
Text Secondary     : #3D3D3D
Border             : #000000
Typography
Font Heading  : Space Grotesk (Google Fonts) — weight 700, 800
Font Body     : Inter — weight 400, 500
Font Mono     : JetBrains Mono — untuk code/tag elements
Komponen Signature
css/* Card Neobrutalism */
.card {
  background: #FFFFFF;
  border: 2px solid #000000;
  box-shadow: 4px 4px 0px #000000;
  border-radius: 8px;
  transition: all 0.15s ease;
}
.card:hover {
  box-shadow: 2px 2px 0px #000000;
  transform: translate(2px, 2px);
}

/* Button Primary */
.btn-primary {
  background: #FFE500;
  border: 2px solid #000000;
  box-shadow: 3px 3px 0px #000000;
  font-weight: 800;
  color: #000000;
}
.btn-primary:hover {
  box-shadow: 1px 1px 0px #000000;
  transform: translate(2px, 2px);
}

/* Badge / Tag */
.badge {
  background: #000000;
  color: #FFE500;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 8px;
}
Panduan Penggunaan AI untuk Styling
Ketika menggunakan AI assistant untuk generate komponen UI, selalu sertakan instruksi berikut:

"Gunakan design system neobrutalism dengan border 2px solid hitam, box-shadow offset 4px 4px 0px #000, background putih atau krem (#F5F0E8), accent color kuning #FFE500, font Space Grotesk bold untuk heading. Tidak ada gradient. Hover effect: translate(2px, 2px) dan shadow mengecil."


🛠️ Tech Stack
Frontend
TeknologiVersiKegunaanNext.16+ (App Router)Framework utama, SSR, routingTypeScript5+Type safetyTailwind CSS3+Utility stylingFramer MotionlatestAnimasi UIReact DnD KitlatestDrag-and-drop kanbanZustandlatestState management client
Backend
TeknologiVersiKegunaanNext.js API Routes—REST API endpointsNextAuth.jsv5Authentication & sessionPrisma ORMlatestDatabase query layerZodlatestSchema validation
Database & Real-time
TeknologiKegunaanNeonDB (PostgreSQL)Database utama — serverless, scalablePusher ChannelsReal-time: chat, kanban sync, notifikasi, presence
External Services
TeknologiKegunaanResendTransactional email (verifikasi, notifikasi, digest)Cloudinary / UploadthingUpload foto profilVercelDeployment

🗄️ Database Schema (Ringkas)
prismamodel User {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  emailVerified   DateTime?
  image           String?
  bio             String?
  linkedinUrl     String?
  portfolioUrl    String?
  githubUrl       String?
  trustScore      Int      @default(20)
  trustLevel      TrustLevel @default(NEWCOMER)
  availStatus     AvailStatus @default(OPEN)
  isStudentVerified Boolean @default(false)
  skills          UserSkill[]
  projectsOwned   Project[]  @relation("owner")
  memberships     ProjectMember[]
  reviewsGiven    PeerReview[] @relation("reviewer")
  reviewsReceived PeerReview[] @relation("reviewed")
  endorsements    SkillEndorsement[] @relation("endorsed")
  bookmarks       Bookmark[]
  createdAt       DateTime @default(now())
}

model Project {
  id              String   @id @default(cuid())
  title           String
  description     String
  category        ProjectCategory
  commitmentLevel CommitmentLevel
  sdgTag          SDGTag
  maxMembers      Int
  status          ProjectStatus @default(OPEN)
  ownerId         String
  owner           User     @relation("owner", fields: [ownerId], references: [id])
  requiredSkills  ProjectSkill[]
  members         ProjectMember[]
  tasks           Task[]
  chatMessages    ChatMessage[]
  polls           Poll[]
  bookmarks       Bookmark[]
  createdAt       DateTime @default(now())
  deadline        DateTime?
}

model ProjectMember {
  id            String   @id @default(cuid())
  projectId     String
  userId        String
  isAnonymous   Boolean  @default(false)
  anonymousTag  String?
  revealedAt    DateTime?
  role          MemberRole @default(MEMBER)
  joinedAt      DateTime @default(now())
  project       Project  @relation(fields: [projectId], references: [id])
  user          User     @relation(fields: [userId], references: [id])
}

model Task {
  id          String     @id @default(cuid())
  projectId   String
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  assigneeId  String?
  labelTag    String?
  deadline    DateTime?
  position    Int
  project     Project    @relation(fields: [projectId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model ChatMessage {
  id        String   @id @default(cuid())
  projectId String
  senderId  String
  content   String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
}

model PeerReview {
  id           String   @id @default(cuid())
  projectId    String
  reviewerId   String
  reviewedId   String
  rating       Int
  behaviorTags String[]
  reviewer     User     @relation("reviewer", fields: [reviewerId], references: [id])
  reviewed     User     @relation("reviewed", fields: [reviewedId], references: [id])
  createdAt    DateTime @default(now())
}

model SkillEndorsement {
  id          String @id @default(cuid())
  endorsedId  String
  endorserId  String
  skillName   String
  endorsed    User   @relation("endorsed", fields: [endorsedId], references: [id])
  createdAt   DateTime @default(now())
}

enum TrustLevel   { NEWCOMER MEMBER TRUSTED VERIFIED }
enum AvailStatus  { OPEN FOCUS BUSY }
enum ProjectCategory { LOMBA STARTUP KREATIF BELAJAR SOSIAL }
enum CommitmentLevel { CASUAL SERIUS KOMPETISI }
enum SDGTag       { SDG8 SDG9 SDG12 }
enum ProjectStatus { OPEN IN_PROGRESS COMPLETED ARCHIVED }
enum TaskStatus   { TODO IN_PROGRESS DONE }
enum Priority     { LOW MEDIUM HIGH }
enum MemberRole   { OWNER MEMBER }

📁 Struktur Folder
collabolab/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── project/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Detail project
│   │   │   │   └── room/
│   │   │   │       └── page.tsx      # Collab Room
│   │   │   └── create/
│   │   └── profile/
│   │       └── [username]/
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── chat/
│   │   ├── pusher/
│   │   │   └── auth/                 # Pusher channel auth
│   │   ├── reviews/
│   │   └── users/
│   ├── onboarding/
│   └── page.tsx                      # Landing page
├── components/
│   ├── ui/                           # Design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── TrustScoreBadge.tsx
│   ├── landing/
│   ├── explore/
│   │   ├── ProjectCard.tsx           # Includes SkillMatchIndicator
│   │   └── FilterBar.tsx
│   ├── room/
│   │   ├── KanbanBoard.tsx
│   │   ├── LiveChat.tsx
│   │   ├── PresenceIndicator.tsx
│   │   └── QuickPoll.tsx
│   └── onboarding/
│       ├── SkillTagPicker.tsx
│       └── TrustScoreReveal.tsx
├── lib/
│   ├── pusher.ts                     # Pusher client & server config
│   ├── resend.ts                     # Email templates
│   ├── trust-score.ts                # Trust score calculation logic
│   └── skill-match.ts                # Skill match percentage logic
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts

🚀 Setup & Instalasi
bash# Clone repository
git clone https://github.com/[username]/SEFEST26WEBDESIGN_[NamaTim]
cd SEFEST26WEBDESIGN_[NamaTim]

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
Environment Variables
env# Database (NeonDB)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Pusher
PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER="..."
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."

# Resend (Email)
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="noreply@collaboLab.id"

# Upload (Cloudinary / Uploadthing)
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
bash# Push schema ke database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Jalankan development server
npm run dev

📄 Halaman & Routes
RouteDeskripsi/Landing page — hero, why, how it works, explore preview/registerForm registrasi 4 field/loginLogin/onboarding3-step onboarding setelah verifikasi email/dashboardDashboard utama — feed, my projects, notifikasi/exploreDiscovery feed semua project dengan filter/project/createForm buat project baru dengan template/project/[id]Detail project — deskripsi, anggota, apply/project/[id]/roomCollab Room — chat, kanban, presence, poll/profile/[username]Profil publik — skill, endorsement, riwayat project/settingsEdit profil, availability status, keamanan

🎯 Pemetaan Fitur vs Kriteria Penilaian
KriteriaBobotFitur yang MenjawabUI/UX30%Neobrutalism design system, skill match indicator visual, trust score badge, onboarding progresif, availability status, project progress barKreativitas & Orisinalitas25%Anonymous Ice-Breaker Mode, sistem reputasi multi-layer, skill endorsement peer-to-peer, quick poll real-timeKesesuaian Tema & SDGs20%SDG 8 & 9 tersematkan di core concept, SDG tag wajib di setiap project, narasi techpreneur di landing pageStruktur & Layout Website20%Next.js App Router, komponen modular, navigasi intuitif, responsive layout, loading state yang konsistenKualitas Proposal5%Dokumen ini + proposal terpisah

👥 Tim

Isi dengan nama anggota tim

NamaRoleInstitusi———

📎 Catatan untuk AI Assistant
Jika kamu adalah AI assistant yang membantu pengembangan project ini, berikut konteks penting:
Tentang Platform:
CollaboLab adalah platform kolaborasi Gen-Z dengan sistem reputasi. Bukan job board, bukan social media — melainkan ruang kerja bersama yang mempertemukan orang berdasarkan skill dan tujuan project.
Tentang Desain:
SELALU gunakan neobrutalism. Ciri khasnya: border hitam tebal, box-shadow offset, warna solid (kuning #FFE500 untuk CTA, hitam #000000 untuk border), font Space Grotesk bold untuk heading. TIDAK ADA gradient, TIDAK ADA shadow halus, TIDAK ADA desain minimalis/clean.
Tentang Tech Stack:

Framework: Next.js 16 App Router dengan TypeScript
Database: NeonDB via Prisma ORM
Real-time: Pusher Channels (chat, kanban sync, presence, notifikasi)
Email: Resend
Auth: NextAuth.js v5

Tentang Fitur Kritis:

Trust Score adalah sistem reputasi — setiap aksi user mempengaruhi score
Pusher digunakan untuk chat, kanban drag-drop sync, presence indicator, dan quick poll
Anonymous Mode menggunakan field is_anonymous dan revealed_at di tabel ProjectMember
Skill Match dihitung dengan membandingkan array skill user vs skill yang dibutuhkan project

Konvensi Kode:

Komponen: PascalCase
Functions & variables: camelCase
Database fields: camelCase (Prisma)
API routes: kebab-case
Selalu gunakan TypeScript strict mode
Server components by default, "use client" hanya ketika butuh interaktivitas


CollaboLab — SEFEST 2026 | HIMSE Telkom University Surabaya
<!-- END:nextjs-agent-rules -->
