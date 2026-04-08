import { useState } from "react";

export default function OnboardingScreen({ onDone }) {
  const [name, setName] = useState("");
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (!name.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onDone(name.trim());
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(135deg,#0a1628 0%,#0d3d7a 50%,#1a72c9 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, fontFamily: "'DM Serif Display',Georgia,serif"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.97)", borderRadius: 24, padding: "40px 36px 32px",
        width: "100%", maxWidth: 380, textAlign: "center",
        boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
        animation: "popIn 0.6s cubic-bezier(.22,1,.36,1) both"
      }}>
        <style>{`
          @keyframes popIn{from{opacity:0;transform:scale(.85) translateY(24px)}to{opacity:1;transform:scale(1) translateY(0)}}
          @keyframes shakeIt{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        `}</style>

        <div style={{ fontSize: 38, marginBottom: 6, fontFamily: "'DM Serif Display',serif" }}>
          <span style={{ color: "#1a2e5c" }}>take</span>
          <span style={{ color: "#1a72c9", fontStyle: "italic" }}>U</span>
          <span style={{ color: "#1a2e5c" }}>forward</span>
        </div>
        <div style={{
          width: 52, height: 3,
          background: "linear-gradient(90deg,#1a72c9,#0d3d7a)",
          borderRadius: 2, margin: "0 auto 20px"
        }} />

        <h1 style={{
          fontSize: 24, fontWeight: 700, color: "#1a2e5c",
          margin: "0 0 8px", fontFamily: "'DM Serif Display',serif"
        }}>Welcome! 👋</h1>
        <p style={{
          fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6,
          fontFamily: "'Nunito',sans-serif"
        }}>
          Enter your name to personalise your calendar and start your journey.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your name..."
          style={{
            width: "100%",
            border: `2px solid ${shake ? "#e24b4a" : "#e4e6ee"}`,
            borderRadius: 10, padding: "12px 14px", fontSize: 15,
            color: "#1a2e5c", outline: "none",
            fontFamily: "'Nunito',sans-serif", fontWeight: 600,
            boxSizing: "border-box", transition: "border-color .2s", marginBottom: 12,
            animation: shake ? "shakeIt 0.4s" : "none"
          }}
          autoFocus
        />

        <button
          onClick={submit}
          style={{
            width: "100%", padding: "13px", borderRadius: 12, border: "none",
            background: "linear-gradient(90deg,#1a72c9,#0d3d7a)", color: "#fff",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Nunito',sans-serif",
            boxShadow: "0 6px 20px rgba(26,114,201,.4)",
            transition: "transform .2s,box-shadow .2s"
          }}
          onMouseOver={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(26,114,201,.5)"; }}
          onMouseOut={(e)  => { e.target.style.transform = "translateY(0)";    e.target.style.boxShadow = "0 6px 20px rgba(26,114,201,.4)";  }}
        >
          Start My Journey →
        </button>
      </div>
    </div>
  );
}