<div align="center">
  <img src="./public/logo.png" alt="CollaboLab Logo" width="180" />
  <br />
  <br />
  <img src="https://img.shields.io/badge/SEFEST-2026-FFE500?style=for-the-badge&logo=code&logoColor=black" alt="SEFEST 2026" />
  <img src="https://img.shields.io/badge/Team-Galatea-0047FF?style=for-the-badge" alt="Team Galatea" />
  <img src="https://img.shields.io/badge/Status-Development-00D37F?style=for-the-badge" alt="Status" />
  <br />
  <br />
  <h1>🤝 CollaboLab</h1>
  <p><b>Find Your People. Build Together.</b></p>
  <p><i>Platform kolaborasi real-time bergaya Neobrutalism untuk Gen-Z. Dibangun dengan sistem reputasi untuk ekosistem kolaborasi yang bebas ghosting dan spam.</i></p>
  <br />
</div>

---

## 🎯 Latar Belakang & SEFEST 2026
Proyek ini dikembangkan oleh **Team Galatea** untuk mengikuti **SEFEST 2026 (Software Engineering Festival)** kategori *Web Design* yang diselenggarakan oleh HIMSE Telkom University Surabaya.

Membawa tema *"Gen-Z TechPreneur: Digital Solutions for a Sustainable Future"*, CollaboLab hadir sebagai perwujudan digital dari:
- **SDG 8 (Decent Work and Economic Growth):** Memfasilitasi ekosistem kerja kolaboratif yang inklusif untuk pelajar/mahasiswa dalam membangun portofolio.
- **SDG 9 (Industry, Innovation and Infrastructure):** Menyediakan infrastruktur digital inovatif yang aman, real-time, dan terpercaya.

---

## 💡 Problem & Solusi
Gen-Z memiliki segudang ide brilian, namun sering kali terhambat oleh:
1. **Susah cari tim:** Tidak ada wadah terpusat berbasis *skill-match*.
2. **Krisis Kepercayaan:** Maraknya *ghosting*, *spam*, dan anggota tim parasit (freeloader).
3. **Anxiety & Introvert:** Ragu untuk memulai perkenalan online dengan orang asing.

**Solusi CollaboLab:**
Bukan sekadar aplikasi "cari teman", melainkan sebuah **Sistem Manajemen Mutu Berbasis Reputasi**. Kami membangun *Trust Score Engine* yang menilai secara otomatis keandalan seseorang berdasarkan penyelesaian tugas, umur akun, dan ulasan rekan satu tim.

---

## ✨ Fitur Unggulan

### 🛡️ 1. Trust Score & Anti-Farming Engine
Sistem poin canggih yang menghukum *ghosting* dan memberi *reward* pada kolaborasi nyata.
- **Dynamic Event Score:** Poin aman bertambah saat project sukses.
- **Anti-Farming:** Sistem menolak pemberian poin jika project belum berumur > 1 hari dan belum ada minimal 2 task yang *Done*.
- **Admin Review Task:** Poin bonus (+2) otomatis diberikan *hanya* setelah Project Owner menekan tombol `Approve` pada Kanban board.

### 🏠 2. Real-Time Collab Room
Ruang kerja virtual yang tersinkronisasi dalam hitungan milidetik (*powered by Pusher*).
- **Live Chat:** Diskusi real-time lengkap dengan sistem `@mention`.
- **Kanban Board:** Sistem geser *Drag-and-Drop*. Jika task sudah di-*Approve*, task otomatis terkunci untuk mencegah manipulasi.
- **Quick Poll:** Polling instan untuk mengambil keputusan tim.

### 🕵️ 3. Anonymous Ice-Breaker Mode
Malu ngobrol duluan? Gunakan identitas anonim (`Anon#1042`) saat bergabung ke sebuah project. Identitas asli dapat diungkap (*reveal*) kapan saja setelah user merasa nyaman dengan tim barunya.

### 🎯 4. Smart Skill Matchmaking
Pencarian project yang mengkalkulasi persentase kecocokan antara *Skill Tags* yang kamu miliki dengan kebutuhan *Owner* project.

---

## 🎨 Design System: Neobrutalism
CollaboLab menolak desain modern-minimalis yang membosankan. Kami mengadopsi gaya **Neobrutalism** yang mencerminkan energi Gen-Z: *Bold, Berani, dan Anti-Mainstream*.
- **Ciri Khas:** Border hitam tebal (3px), bayangan offset solid (`4px 4px 0px #000`), dan warna-warna neon kontras (Kuning `#FFE500`, Mint `#00D37F`).
- **Typography:** Space Grotesk (Heading) & Inter (Body).

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 16+ (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 3+](https://tailwindcss.com/)
- [dnd-kit](https://dndkit.com/) (Drag & Drop Kanban)

**Backend & Database:**
- Next.js API Routes (Serverless)
- [Prisma ORM](https://www.prisma.io/)
- [NeonDB](https://neon.tech/) (PostgreSQL Serverless)

**Real-time & Auth:**
- [Pusher Channels](https://pusher.com/) (WebSockets)
- [NextAuth.js v5](https://next-auth.js.org/)

---

## 🚀 Panduan Instalasi Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/WahyuAndikaRahadi/Collabolab.git
   cd collabolab
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Siapkan Environment Variables:**
   Duplikat file `.env.example` menjadi `.env` lalu isi *credentials* database Neon, Auth, dan Pusher.
   ```bash
   cp .env.example .env
   ```

4. **Sinkronisasi Database:**
   ```bash
   npx prisma db push
   ```

5. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Akses `http://localhost:3000` di browser.

---

<div align="center">
  <p>Dibuat dengan 💻 dan ☕ oleh <b>Team Galatea</b> untuk SEFEST 2026.</p>
</div>
