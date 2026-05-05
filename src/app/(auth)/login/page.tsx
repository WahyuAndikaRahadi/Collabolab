"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isVerified = searchParams.get("verified") === "1";

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah, atau email belum diverifikasi.");
        return;
      }

      router.push(callbackUrl);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "3px solid #000",
        borderRadius: "8px",
        boxShadow: "8px 8px 0px #000",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            background: "#FFE500",
            border: "2px solid #000",
            borderRadius: "6px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "18px" }}>👋</span>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px" }}>
            Selamat Datang
          </span>
        </div>
        <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", margin: "0 0 8px" }}>
          Masuk ke CollaboLab
        </h1>
        <p style={{ color: "#3D3D3D", fontSize: "15px", margin: 0 }}>
          Tim-mu menunggu kamu! 🤝
        </p>
      </div>

      {isVerified && (
        <div
          style={{
            background: "#E6FFF5",
            border: "2px solid #00D37F",
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#00A060",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          ✅ Email berhasil diverifikasi! Silakan masuk.
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#FFF0F0",
            border: "2px solid #FF4D4D",
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: "#FF4D4D",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="nb-input"
            placeholder="kamu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="nb-input"
            placeholder="Password kamu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          id="login-submit-btn"
          disabled={isLoading}
          style={{ marginTop: "8px", fontSize: "16px", padding: "14px" }}
        >
          {isLoading ? "Masuk..." : "Masuk →"}
        </button>
      </form>

      <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ flex: 1, height: "2px", background: "#E5E5E5" }} />
        <span style={{ fontSize: "12px", color: "#666", fontWeight: 700 }}>ATAU</span>
        <div style={{ flex: 1, height: "2px", background: "#E5E5E5" }} />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        style={{
          width: "100%",
          padding: "14px",
          background: "#fff",
          border: "2px solid #000",
          borderRadius: "6px",
          boxShadow: "4px 4px 0px #000",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          transition: "all 0.15s ease",
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px #000"; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #000"; }}
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
        Masuk dengan Google
      </button>

      <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#3D3D3D" }}>
        Belum punya akun?{" "}
        <Link href="/register" style={{ color: "#0047FF", fontWeight: 700, textDecoration: "none" }}>
          Daftar Gratis →
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
