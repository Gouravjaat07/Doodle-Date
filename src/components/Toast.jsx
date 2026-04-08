export default function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%",
      transform: `translateX(-50%) translateY(${show ? 0 : 80}px)`,
      background: "#1a2e5c", color: "#fff", padding: "10px 22px", borderRadius: 24,
      fontSize: 13, fontWeight: 700, zIndex: 3000,
      transition: "transform .35s cubic-bezier(.22,1,.36,1)",
      opacity: show ? 1 : 0, pointerEvents: "none", whiteSpace: "nowrap",
      fontFamily: "'Nunito',sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,.35)"
    }}>{msg}</div>
  );
}