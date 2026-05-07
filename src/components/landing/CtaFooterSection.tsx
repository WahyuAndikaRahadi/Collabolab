import Link from "next/link";

export function CtaFooterSection() {
  return (
    <section style={{ background: "#F5F0E8", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
      {/* Wavy Divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          lineHeight: 0,
          zIndex: 0,
          transform: "translateY(-1px)",
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "auto" }}
        >
          <path
            d="M0 40C240 100 480 0 720 40C960 80 1200 20 1440 40V0H0V40Z"
            fill="#FFFFFF"
          />
          <path
            d="M0 40C240 100 480 0 720 40C960 80 1200 20 1440 40"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Decorations */}
      <div
        style={{
          position: "absolute",
          top: "160px",
          left: "-40px",
          width: "200px",
          height: "200px",
          background: "#FFE500",
          border: "3px solid #000",
          transform: "rotate(15deg)",
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "240px",
          height: "240px",
          background: "#00D37F",
          border: "3px solid #000",
          borderRadius: "50%",
          opacity: 0.1,
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#000",
            color: "#FFE500",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800,
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: "4px",
            marginBottom: "24px",
            boxShadow: "3px 3px 0px #FFE500",
          }}
        >
          🤝 BERGABUNG SEKARANG
        </span>

        <h2
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 6vw, 64px)",
            color: "#000",
            marginBottom: "20px",
            lineHeight: 1.1,
          }}
        >
          Siap kolaborasi?{" "}
          <span
            style={{
              background: "#FFE500",
              color: "#000",
              padding: "0 12px",
              display: "inline-block",
              transform: "rotate(-1deg)",
              border: "3px solid #000",
              boxShadow: "4px 4px 0px #000",
            }}
          >
            Daftar gratis
          </span>{" "}
          sekarang.
        </h2>

        <p
          style={{
            color: "#3D3D3D",
            fontSize: "18px",
            lineHeight: 1.7,
            marginBottom: "40px",
            maxWidth: "500px",
            margin: "0 auto 40px",
          }}
        >
          Ribuan Gen-Z sudah menemukan tim impian mereka. Giliranmu!
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/register"
            className="btn-primary btn-lg"
            id="cta-footer-register"
          >
            🚀 Mulai Gratis — 30 detik
          </Link>
          <Link
            href="/explore"
            id="cta-footer-explore"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#fff",
              color: "#000",
              border: "3px solid #000",
              borderRadius: "4px",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              padding: "16px 32px",
              textDecoration: "none",
              transition: "all 0.15s ease",
              boxShadow: "4px 4px 0px #000",
            }}
          >
            Lihat Project Dulu
          </Link>
        </div>

        {/* Trust indicators */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {[
            "Gratis Selamanya",
            "Trust Score System",
            "Anonymous Mode",
            "Real-time Collab",
          ].map((label) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", background: "#FFE500", border: "1.5px solid #000", borderRadius: "50%" }} />
              <span style={{ color: "#000", fontSize: "14px", fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer credit */}
      <div
        style={{
          textAlign: "center",
          marginTop: "64px",
          paddingTop: "32px",
          borderTop: "3px solid #000",
          color: "#3D3D3D",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <p>© {new Date().getFullYear()} CollaboLab — Team Galatea</p>
        <p style={{ marginTop: "4px", opacity: 0.7 }}>Gen-Z TechPreneur</p>
      </div>
    </section>
  );
}
