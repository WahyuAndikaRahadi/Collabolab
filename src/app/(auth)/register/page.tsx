"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Metadata } from "next";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar");
      setEmail(form.email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Masukkan 6 digit kode OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kode OTP tidak valid");
      router.push("/login?verified=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOtpInput(value: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKey(e: React.KeyboardEvent, index: number) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
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
        maxWidth: "460px",
      }}
    >
      {step === "form" ? (
        <>
          {/* Header */}
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
              <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: "14px" }}>
                Daftar Gratis
              </span>
            </div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "28px", margin: "0 0 8px" }}>
              Mulai kolaborasimu
            </h1>
            <p style={{ color: "#3D3D3D", fontSize: "15px", margin: 0 }}>
              30 detik daftar, seumur hidup berkolaborasi 🤝
            </p>
          </div>

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

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Nama Lengkap
              </label>
              <input
                id="register-name"
                type="text"
                className="nb-input"
                placeholder="Misal: Budi Santoso"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className="nb-input"
                placeholder="galatea@gmail.com"
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
              <div style={{ position: "relative" }}>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="nb-input"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: "50px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    transition: "color 0.15s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                  onMouseOut={(e) => e.currentTarget.style.color = "#666"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: "14px", display: "block", marginBottom: "6px" }}>
                Konfirmasi Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="nb-input"
                  placeholder="Ulangi password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: "50px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    transition: "color 0.15s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#000"}
                  onMouseOut={(e) => e.currentTarget.style.color = "#666"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="register-submit-btn"
              disabled={isLoading}
              style={{ marginTop: "8px", fontSize: "16px", padding: "14px" }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                  <span style={{ width: "16px", height: "16px", border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                  Mendaftar...
                </span>
              ) : (
                "Daftar & Kirim OTP Email →"
              )}
            </button>
          </form>

          <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "2px", background: "#E5E5E5" }} />
            <span style={{ fontSize: "12px", color: "#666", fontWeight: 700 }}>ATAU</span>
            <div style={{ flex: 1, height: "2px", background: "#E5E5E5" }} />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
            Daftar dengan Google
          </button>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#3D3D3D" }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "#0047FF", fontWeight: 700, textDecoration: "none" }}>
              Masuk →
            </Link>
          </p>
        </>
      ) : (
        <>
          {/* OTP Step */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: "24px", margin: "0 0 8px" }}>
              Cek emailmu!
            </h1>
            <p style={{ color: "#3D3D3D", fontSize: "15px", margin: 0 }}>
              Kode OTP 6 digit dikirim ke <strong>{email}</strong>. Berlaku 10 menit.
            </p>
          </div>

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

          <form onSubmit={handleVerifyOtp}>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  id={`otp-digit-${i + 1}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKey(e, i)}
                  className={`otp-input ${digit ? "has-value" : ""}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="otp-verify-btn"
              disabled={isLoading}
              style={{ width: "100%", fontSize: "16px", padding: "14px" }}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi Email ✓"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#3D3D3D" }}>
            Tidak menerima email?{" "}
            <button
              onClick={() => setStep("form")}
              style={{ background: "none", border: "none", color: "#0047FF", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
            >
              Coba lagi
            </button>
          </p>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
