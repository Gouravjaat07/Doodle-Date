/**
 * Generic slide-up / fade modal with a close button.
 */
export default function Modal({ open, onClose, title, children }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden",
        transition: "opacity .28s"
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 18, padding: "26px 24px 22px",
        width: "100%", maxWidth: 480, position: "relative",
        transform: open ? "translateY(0) scale(1)" : "translateY(18px) scale(.96)",
        transition: "transform .3s cubic-bezier(.22,1,.36,1)",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,.3)"
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14, background: "none", border: "none",
            fontSize: 22, cursor: "pointer", color: "#aaa", lineHeight: 1,
            width: 32, height: 32, display: "flex", alignItems: "center",
            justifyContent: "center", borderRadius: "50%", transition: "background .2s",
            fontFamily: "inherit"
          }}
          onMouseOver={(e) => e.target.style.background = "#f0f0f0"}
          onMouseOut={(e)  => e.target.style.background = "none"}
        >×</button>

        {/* Title */}
        <div style={{
          fontSize: 19, fontWeight: 900, color: "#1a2e5c", marginBottom: 16,
          fontFamily: "'DM Serif Display',serif"
        }}>{title}</div>

        {children}
      </div>
    </div>
  );
}

/* ── Shared form primitives ───────────────────────────────────────────────── */
export const modalInput = {
  width: "100%", border: "1.5px solid #e4e6ee", borderRadius: 8,
  padding: "9px 12px", fontSize: 13.5, color: "#1a1a2e", background: "#f8f9fc",
  fontFamily: "'Nunito',sans-serif", outline: "none", boxSizing: "border-box",
  transition: "border-color .2s"
};

export const modalLabel = {
  display: "block", fontSize: 11, fontWeight: 800, color: "#8a8a9a",
  marginBottom: 4, marginTop: 13, textTransform: "uppercase", letterSpacing: ".4px",
  fontFamily: "'Nunito',sans-serif"
};

export const modalBtn = (danger = false, sec = false) => ({
  width: "100%", padding: "11px", borderRadius: 10,
  border: sec ? "1.5px solid #e4e6ee" : "none",
  background: danger ? "rgba(220,38,38,.1)" : sec ? "#f8f9fc" : "#1a72c9",
  color: danger ? "#c0392b" : sec ? "#444" : "#fff",
  fontSize: 14, fontWeight: 800, cursor: "pointer",
  fontFamily: "'Nunito',sans-serif",
  marginTop: sec || danger ? 7 : 16,
  transition: "all .2s",
  boxShadow: !sec && !danger ? "0 4px 14px rgba(26,114,201,.3)" : "none"
});