/**
 * RealisticBrandBar.jsx
 * Uses the real Brand_bar.png image instead of SVG-drawn version.
 * User chip and dark toggle are overlaid on top.
 */
export default function RealisticBrandBar({ dark, user, onProfileClick, onDarkToggle }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>

      {/* ── Real brand bar image ── */}
      <img
  src="/images/Calendar_Bg_Color.png"
  alt="takeUforward brand bar"
  draggable={false}
  style={{
    display: "block",
    width: "100%",        // ✅ FIXED
    height: "120",
    objectFit: "cover",   // 🔥 important
    userSelect: "none",
    pointerEvents: "none",
  }}
/>

      {/* ── User chip (left, overlaid) ── */}
      <button
        onClick={onProfileClick}
        style={{
          position: "absolute", left: 14, bottom: 14,
          display: "flex", alignItems: "center", gap: 6,
          background: dark ? "rgba(18,23,42,0.85)" : "rgba(244,246,251,0.90)",
          backdropFilter: "blur(6px)",
          borderRadius: 20, padding: "3px 9px 3px 4px",
          border: `1.5px solid ${dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"}`,
          cursor: "pointer", fontFamily: "'Nunito',sans-serif",
          transition: "border-color .2s, background .2s", zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,.12)",
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = "#1a72c9"}
        onMouseOut={e  => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"}
      >
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "linear-gradient(135deg,#1a72c9,#0d3d7a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0,
        }}>
          {(user || "U")[0].toUpperCase()}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: dark ? "#e8eaf0" : "#1a1a2e",
          whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis", maxWidth: 72,
        }}>
          {user || "User"}
        </span>
      </button>

      {/* ── Dark toggle (right, overlaid) ── */}
      <button
        onClick={onDarkToggle}
        style={{
          position: "absolute", right: 14, bottom: 14,
          background: dark ? "rgba(18,23,42,0.85)" : "rgba(244,246,251,0.90)",
          backdropFilter: "blur(6px)",
          border: `1.5px solid ${dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"}`,
          borderRadius: 20, padding: "3px 9px",
          cursor: "pointer", fontSize: 13,
          transition: "border-color .2s",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,.12)",
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = "#1a72c9"}
        onMouseOut={e  => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"}
      >
        {dark ? "☀️" : "🌙"}
      </button>

    </div>
  );
}