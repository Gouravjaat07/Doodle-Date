/**
 * RealisticBrandBar.jsx — RESPONSIVE
 * Adapts toggle & avatar size for mobile/tablet/desktop
 */

function MoonIcon({ active, size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{
        transition:"opacity .3s, transform .3s, filter .3s",
        opacity: active ? 1 : 0.32,
        transform: active ? "scale(1.15)" : "scale(0.9)",
        filter: active
          ? "drop-shadow(0 0 6px rgba(160,185,255,1)) drop-shadow(0 0 12px rgba(160,185,255,0.9))"
          : "none",
      }}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill={active ? "#c8d4ff" : "#6677aa"} />
    </svg>
  );
}

function SunIcon({ active, size = 15 }) {
  const c = active ? "#ffd84a" : "#887730";
  const rays = [0,45,90,135,180,225,270,315];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{
        transition:"opacity .3s, transform .3s, filter .3s",
        opacity: active ? 1 : 0.32,
        transform: active ? "scale(1.15)" : "scale(0.9)",
        filter: active ? "drop-shadow(0 0 4px rgba(255,210,60,0.9))" : "none",
      }}>
      <circle cx="12" cy="12" r="4" fill={c} />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={12 + 7*Math.cos(rad)}   y1={12 + 7*Math.sin(rad)}
            x2={12 + 9.5*Math.cos(rad)} y2={12 + 9.5*Math.sin(rad)}
            stroke={c} strokeWidth="2" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

function PhysicalToggle({ dark, onToggle, compact = false }) {
  const w = compact ? 60 : 80;
  const h = compact ? 30 : 38;
  const r = h / 2;
  const knobSize = compact ? 22 : 28;
  const knobTop = (h - knobSize) / 2;
  const knobRight = w - knobSize - knobTop;

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(180deg, #000000 0%, #050505 100%)"; }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = dark
          ? "linear-gradient(180deg, #050a18 0%, #0c1522 50%, #040810 100%)"
          : "linear-gradient(180deg, #b5cde6 0%, #daeaf8 50%, #a5c0da 100%)";
      }}
      style={{
        position:"relative", width:w, height:h, borderRadius:r,
        border:"none", outline:"none", cursor:"pointer",
        padding:`0 ${compact?7:10}px`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        overflow:"hidden", transition:"all .35s",
        background: dark
          ? "linear-gradient(180deg, #050a18 0%, #0c1522 50%, #040810 100%)"
          : "linear-gradient(180deg, #b5cde6 0%, #daeaf8 50%, #a5c0da 100%)",
        boxShadow: dark
          ? "inset 0 3px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.5)"
          : "inset 0 3px 8px rgba(0,0,0,0.18), 0 4px 16px rgba(50,100,180,0.18)"
      }}>
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"44%",
        borderRadius:`${r}px ${r}px 50% 50%`,
        background: dark
          ? "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.52) 0%, transparent 100%)",
        pointerEvents:"none", zIndex:1
      }}/>
      <div style={{ position:"relative", zIndex:2, lineHeight:0 }}>
        <MoonIcon active={dark} size={compact?12:15} />
      </div>
      <div style={{ position:"relative", zIndex:2, lineHeight:0 }}>
        <SunIcon active={!dark} size={compact?12:15} />
      </div>
      <div style={{
        position:"absolute", top:knobTop,
        left: dark ? knobTop : knobRight,
        width:knobSize, height:knobSize, borderRadius:"50%",
        zIndex:3, pointerEvents:"none", overflow:"hidden",
        transition:"left .28s cubic-bezier(.35,1.5,.5,1), background .35s, box-shadow .35s",
        background: dark
          ? "linear-gradient(145deg, #2c3c6c 0%, #161f50 45%, #090e28 100%)"
          : "linear-gradient(145deg, #ffffff 0%, #edf4ff 45%, #d2e4f8 100%)",
        boxShadow: dark
          ? "0 3px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.65), inset 0 1px 3px rgba(90,130,255,0.18), inset 0 -1px 2px rgba(0,0,0,0.6)"
          : "0 3px 10px rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.14), inset 0 1px 3px rgba(255,255,255,0.95), inset 0 -1px 2px rgba(0,50,130,0.08)",
      }}>
        <div style={{
          position:"absolute", top:4, left:4, right:4, height:"36%", borderRadius:"50%",
          background: dark
            ? "radial-gradient(ellipse at 38% 28%, rgba(110,150,255,0.22) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 38% 28%, rgba(255,255,255,0.94) 0%, transparent 68%)",
        }}/>
      </div>
    </button>
  );
}

function ProfileAvatar({ dark, onClick, compact = false }) {
  const size = compact ? 34 : 44;
  return (
    <button
      onClick={onClick}
      aria-label="Open profile"
      style={{
        width:size, height:size, borderRadius:"50%",
        border:"2.5px solid rgba(255,255,255,0.78)",
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        outline:"none", position:"relative", overflow:"hidden",
        flexShrink:0, transition:"transform .15s, box-shadow .2s",
        background: dark
          ? "linear-gradient(145deg, #1c2e62 0%, #0e1d48 45%, #070d26 100%)"
          : "linear-gradient(145deg, #b5dcf8 0%, #72b6ef 40%, #3488d0 100%)",
        boxShadow: dark
          ? "0 4px 14px rgba(0,0,0,0.65), inset 0 1px 3px rgba(80,130,255,0.14), 0 0 0 3px rgba(26,114,201,0.2)"
          : "0 4px 14px rgba(52,136,208,0.44), inset 0 1px 4px rgba(255,255,255,0.68), 0 0 0 3px rgba(52,136,208,0.18)",
      }}
      onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.07)"; }}
      onMouseOut={(e)  => { e.currentTarget.style.transform = "scale(1)"; }}>
      <svg width={compact?17:22} height={compact?17:22} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8.5" r="4" fill="rgba(255,255,255,0.92)" />
        <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" fill="rgba(255,255,255,0.92)" />
      </svg>
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"46%",
        borderRadius:"50% 50% 40% 40%",
        background: dark
          ? "linear-gradient(180deg, rgba(100,150,255,0.12) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.60) 0%, transparent 100%)",
        pointerEvents:"none"
      }}/>
    </button>
  );
}

export default function RealisticBrandBar({ dark, user, onProfileClick, onDarkToggle, compact = false }) {
  const topOffset = compact ? "22px" : "40px";
  return (
    <div style={{ position:"relative", width:"100%", background:"transparent" }}>
      <img
        src="/images/Top-Bar.png"
        alt="takeUforward brand bar"
        draggable={false}
        style={{
          display:"block", width:"100%", height:"auto", objectFit:"cover",
          userSelect:"none", pointerEvents:"none",
          mixBlendMode:"multiply",
          filter: dark ? "invert(1) brightness(0.8)" : "none",
          transition:"filter .35s",
        }}
      />
      <div
        className="brand-overlay"
        style={{
          position:"absolute", inset:0,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:`0 ${compact ? 10 : 18}px`,
          top: topOffset,
          pointerEvents:"none",
        }}>
        <div style={{ pointerEvents:"auto" }}>
          <ProfileAvatar dark={dark} onClick={onProfileClick} compact={compact} />
        </div>
        <div style={{ flex:1 }} />
        <div style={{ pointerEvents:"auto" }}>
          <PhysicalToggle dark={dark} onToggle={onDarkToggle} compact={compact} />
        </div>
      </div>
    </div>
  );
}