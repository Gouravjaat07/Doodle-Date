import { useState, useEffect, useRef, useCallback } from "react";

import { TODAY, getZodiac, fmtDate } from "./utils/dateUtils";
import { MONTHS }                    from "./utils/constants";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useCalendar }     from "./hooks/useCalendar";
import { useDiary }        from "./hooks/useDiary";

import Toast               from "./components/Toast";
import Onboarding          from "./components/Onboarding";
import Calendar            from "./components/Calendar";
import Notes               from "./components/Notes";
import Profile             from "./components/Profile";
import RealisticBrandBar   from "./components/RealisticBrandBar";
import {
  DiaryCard,
  NewDiaryModal,
  DiaryListModal,
  DiaryWriteModal,
} from "./components/Diary";

export default function App() {
  /* ── Persistent user state ───────────────────────────────────────────── */
  const [user,   setUser]   = useLocalStorage("tuf_user",   "");
  const [dark,   setDark]   = useLocalStorage("tuf_dark",   false);
  const [heroQ1, setHeroQ1] = useLocalStorage("tuf_hq1",    "One Placement");
  const [heroQ2, setHeroQ2] = useLocalStorage("tuf_hq2",    "can rewrite the story\nof generations");
  const [quote,  setQuote]  = useLocalStorage("tuf_quote",  "Stay focused &\nkeep moving forward.");

  const [notes, setNotes] = useState(() => {
    const dk = fmtDate(TODAY);
    if (localStorage.getItem("tuf_nday") !== dk) {
      localStorage.setItem("tuf_nday", dk);
      return [];
    }
    return JSON.parse(localStorage.getItem("tuf_notes") || "[]");
  });
  useEffect(() => { localStorage.setItem("tuf_notes", JSON.stringify(notes)); }, [notes]);

  /* ── Toast ───────────────────────────────────────────────────────────── */
  const [toast, setToast] = useState({ show: false, msg: "" });
  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);

  /* ── Hooks ───────────────────────────────────────────────────────────── */
  const cal   = useCalendar();
  const diary = useDiary(showToast);

  /* ── Gentle sway animation ───────────────────────────────────────────── */
  const [sway, setSway] = useState(0);
  useEffect(() => {
    let t = 0, raf;
    const animate = () => {
      t += 0.005;
      setSway(Math.sin(t) * 0.3);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Modal visibility ────────────────────────────────────────────────── */
  const [mProfile,    setMProfile]    = useState(false);
  const [mNewDiary,   setMNewDiary]   = useState(false);
  const [mDiaryList,  setMDiaryList]  = useState(false);
  const [mDiaryWrite, setMDiaryWrite] = useState(false);

  /* ── Theme tokens ────────────────────────────────────────────────────── */
  const bgPrimary   = dark ? "#1a1f30" : "#ffffff";
  const textPrimary = dark ? "#e8eaf0" : "#1a1a2e";
  const textMuted   = dark ? "#666888" : "#8a8a9a";
  const bgPanel     = dark ? "#12172a" : "#f4f6fb";
  const borderColor = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";

  /* ── Note handlers ───────────────────────────────────────────────────── */
  const addNote    = ()      => setNotes((n) => [...n, ""]);
  const updateNote = (i, v)  => setNotes((n) => n.map((x, j) => (j === i ? v : x)));
  const deleteNote = (i)     => setNotes((n) => n.filter((_, j) => j !== i));

  /* ── Diary handlers ──────────────────────────────────────────────────── */
  const handleCreateDiary = (formData) => {
    const { id, list } = diary.createDiary({ ...formData, userName: user });
    setTimeout(() => { diary.openDiary(id, list); setMDiaryWrite(true); }, 200);
  };
  const handleOpenDiary = (id) => { diary.openDiary(id); setMDiaryWrite(true); };

  /* ── Zodiac ──────────────────────────────────────────────────────────── */
  const zodiac = getZodiac(TODAY);

  /* ── Onboarding gate ─────────────────────────────────────────────────── */
  if (!user) return <Onboarding onDone={(name) => setUser(name)} />;

  /* ══════════════════════════════════════════════════════════════════════
     WALL COLORS — matched to the real photo background:
     warm sandy beige, lit from top-left with soft leaf shadows.
     Light: #cfc3b0  Dark: #1c1c20
     ══════════════════════════════════════════════════════════════════════ */
  const wallBase = dark ? "#1c1a18" : "#e1c1b1";

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: "100vh",
      background: wallBase,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "100px 20px 80px",
      position: "relative",
      overflow: "hidden",
      transition: "background .4s",
      fontFamily: "'Nunito',sans-serif",
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(26,114,201,.3); border-radius: 2px; }
        .day-cell:hover .day-num:not(.stt):not(.end) { background: rgba(26,114,201,.12); transform: scale(1.08); }
        .note-row  { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; }
        .note-del:hover { color: #e24b4a !important; }
        .diary-entry:hover { border-color: #1a72c9 !important; background: rgba(26,114,201,.06) !important; }
        .mbtn-hover:hover { background: #0d3d7a !important; transform: translateY(-1px); }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════
          WALL LAYERS — tuned to match the sandy-beige photo wall
          ════════════════════════════════════════════════════════════════ */}

      {/* Layer 1 — warm sunlight bloom from top-left (matches photo light source) */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: dark
          ? "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,240,200,.03) 0%, transparent 70%)"
          : "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,248,230,.80) 0%, rgba(240,225,195,.45) 40%, transparent 72%)",
      }} />

      {/* Layer 2 — mid-wall colour variation (plaster unevenness, right side cooler) */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: dark
          ? "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(0,0,0,.22) 0%, transparent 75%)"
          : "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(140,118,90,.14) 0%, transparent 75%)",
      }} />

      {/* Layer 3 — edge vignette (camera lens falloff, matches photo) */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 100% 100% at 50% 50%,
          transparent 40%,
          ${dark ? "rgba(0,0,0,.55)" : "rgba(80,60,35,.32)"} 100%)`,
      }} />

      {/* Layer 4 — micro grain (fractalNoise — plaster texture) */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        opacity: dark ? 0.30 : 0.26,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "240px 240px",
        mixBlendMode: dark ? "multiply" : "soft-light",
      }} />

      {/* Layer 5 — secondary grain pass */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        opacity: dark ? 0.12 : 0.10,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9 0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23h)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }} />

      {/* Layer 6 — directional sunlight streak from top-left */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-20%", left: "-25%",
        width: "85%", height: "85%",
        background: dark
          ? "none"
          : `conic-gradient(
               from 138deg at 20% 16%,
               rgba(255,248,218,.22) 0deg,
               rgba(255,235,170,.10) 20deg,
               transparent 42deg)`,
        filter: "blur(45px)",
        transform: "rotate(-8deg)",
      }} />

      {/* ════════════════════════════════════════════════════════════════
          LEAF SHADOW SYSTEM — 11 organic layers matching photo shadows
          ════════════════════════════════════════════════════════════════ */}

      {/* Leaf 1 — large main frond, left edge */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-6%", left: "-12%",
        width: "52%", height: "62%",
        background: dark
          ? "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(0,0,0,.55) 0%, transparent 65%)"
          : "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(28,45,18,.30) 0%, transparent 65%)",
        transform: "rotate(-38deg) skewX(-12deg)",
        filter: "blur(18px)",
        opacity: 0.92,
      }} />

      {/* Leaf 2 — secondary frond */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "2%", left: "-8%",
        width: "38%", height: "48%",
        background: dark
          ? "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(0,0,0,.45) 0%, transparent 60%)"
          : "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(20,38,14,.25) 0%, transparent 60%)",
        transform: "rotate(-28deg) skewX(-6deg)",
        filter: "blur(14px)",
        opacity: 0.88,
      }} />

      {/* Leaf 3 — thin pointed blade */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-4%", left: "4%",
        width: "28%", height: "55%",
        background: dark
          ? "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(0,0,0,.42) 0%, transparent 55%)"
          : "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(24,42,16,.24) 0%, transparent 55%)",
        transform: "rotate(-52deg) skewY(8deg)",
        filter: "blur(11px)",
        opacity: 0.78,
      }} />

      {/* Leaf 4 — broad rounded leaf */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "8%", left: "-4%",
        width: "45%", height: "38%",
        background: dark
          ? "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(0,0,0,.38) 0%, transparent 58%)"
          : "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(18,36,12,.20) 0%, transparent 58%)",
        transform: "rotate(-18deg)",
        filter: "blur(20px)",
        opacity: 0.72,
      }} />

      {/* Leaf 5 — sharp narrow stem shadow */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "0%", left: "8%",
        width: "14%", height: "68%",
        background: dark
          ? "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(0,0,0,.52) 0%, transparent 70%)"
          : "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(14,32,8,.32) 0%, transparent 70%)",
        transform: "rotate(-42deg)",
        filter: "blur(7px)",
        opacity: 0.68,
      }} />

      {/* Leaf 6 — small leaf tip, lower left */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "38%", left: "-6%",
        width: "30%", height: "28%",
        background: dark
          ? "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(0,0,0,.32) 0%, transparent 55%)"
          : "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(20,40,12,.18) 0%, transparent 55%)",
        transform: "rotate(-8deg) skewX(10deg)",
        filter: "blur(16px)",
        opacity: 0.62,
      }} />

      {/* Leaf 7 — soft diffused canopy */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-18%", left: "-22%",
        width: "68%", height: "72%",
        background: dark
          ? "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(0,0,0,.18) 0%, transparent 70%)"
          : "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(10,28,6,.12) 0%, transparent 70%)",
        filter: "blur(35px)",
        opacity: 1,
      }} />

      {/* Leaf 8 — diagonal cross-blade */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-2%", left: "14%",
        width: "22%", height: "50%",
        background: dark
          ? "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(0,0,0,.40) 0%, transparent 60%)"
          : "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(18,38,10,.22) 0%, transparent 60%)",
        transform: "rotate(-62deg) skewY(-5deg)",
        filter: "blur(9px)",
        opacity: 0.58,
      }} />

      {/* Leaf 9 — light leak gap */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "5%", left: "-2%",
        width: "18%", height: "35%",
        background: dark
          ? "none"
          : "radial-gradient(ellipse 50% 80% at 30% 20%, rgba(255,248,210,.14) 0%, transparent 60%)",
        transform: "rotate(-30deg)",
        filter: "blur(22px)",
        opacity: 0.82,
      }} />

      {/* Leaf 10 — fine twig line */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "12%", left: "6%",
        width: "8%", height: "45%",
        background: dark
          ? "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(0,0,0,.48) 0%, transparent 60%)"
          : "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(10,26,6,.28) 0%, transparent 60%)",
        transform: "rotate(-55deg)",
        filter: "blur(5px)",
        opacity: 0.52,
      }} />

      {/* Leaf 11 — ambient under-canopy scatter */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "25%", left: "-15%",
        width: "55%", height: "40%",
        background: dark
          ? "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(0,0,0,.12) 0%, transparent 65%)"
          : "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(8,20,4,.08) 0%, transparent 65%)",
        filter: "blur(28px)",
        opacity: 0.9,
      }} />

      {/* Warm light pool — bounce fill on centre wall */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "20%", left: "30%",
        width: "55%", height: "50%",
        background: dark
          ? "none"
          : "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,248,225,.16) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Floor ambient — subtle dark near baseboard */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "28%", zIndex: 0, pointerEvents: "none",
        background: dark
          ? "linear-gradient(to top, rgba(0,0,0,.28) 0%, transparent 100%)"
          : "linear-gradient(to top, rgba(70,52,28,.12) 0%, transparent 100%)",
      }} />

      {/* ── Main scene ── */}
      <div style={{ position: "relative", zIndex: 1, width: 600, maxWidth: "100%" }}>

        {/* ── Calendar card ── */}
        <div style={{
          background: bgPrimary,
          borderRadius: "0 0 14px 14px",
          overflow: "hidden",
          boxShadow: dark
            ? "0 8px 24px rgba(0,0,0,.35), 0 30px 70px rgba(0,0,0,.40), 0 60px 120px rgba(0,0,0,.20)"
            : "0 8px 28px rgba(60,40,10,.18), 0 30px 70px rgba(60,40,10,.22), 0 60px 120px rgba(60,40,10,.10)",
          border: `1px solid ${dark ? "rgba(255,255,255,.06)" : "rgba(180,160,130,.25)"}`,
          transform: `rotate(${sway}deg)`,
          transformOrigin: "50% 0",
          transition: "background .3s, border-color .3s",
        }}>

          {/* Brand bar — real image */}
          <RealisticBrandBar
            dark={dark}
            user={user}
            onProfileClick={() => setMProfile(true)}
            onDarkToggle={() => setDark((d) => !d)}
          />

          {/* Hero image */}
          <div style={{
            position: "relative", height: 218, overflow: "hidden",
            background: "linear-gradient(160deg,#1b3d6e,#2a6da8 35%,#5b9fcf 65%,#8fc5e0 85%,#c0ddf0)",
          }}>
            <img
              src="/images/Calendar_Main_Img.png"
              alt="hero"
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center 28%", opacity: .88
              }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.54) 0%,rgba(0,0,0,.15) 58%,transparent)", pointerEvents: "none" }} />
          </div>

          {/* Body: calendar + right panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
            <Calendar
              yr={cal.yr} mo={cal.mo}
              cells={cal.cells}
              prevMonth={cal.prevMonth}
              nextMonth={cal.nextMonth}
              handleDayClick={cal.handleDayClick}
              isStart={cal.isStart}
              isEnd={cal.isEnd}
              isInRange={cal.isInRange}
              isToday={cal.isToday}
              dark={dark}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />

            <div style={{
              background: bgPanel,
              borderLeft: `1px solid ${dark ? "rgba(255,255,255,.1)" : "#e8eaf0"}`,
              padding: "14px 12px 12px",
              display: "flex", flexDirection: "column", gap: 11,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                paddingBottom: 7, borderBottom: "2px solid #1a72c9"
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "#1a72c9",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                    <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.4"/>
                    <line x1="3.5" y1="4.5" x2="9.5" y2="4.5" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="6.8" x2="9.5" y2="6.8" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="9"   x2="7.5" y2="9"   stroke="white" strokeWidth="1.1"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: textPrimary }}>Notes</span>
              </div>

              <Notes
                quote={quote}
                onQuoteChange={setQuote}
                onQuoteBlur={() => localStorage.setItem("tuf_quote", quote)}
                notes={notes}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
                dark={dark}
                textPrimary={textPrimary}
              />

              <DiaryCard
                diaries={diary.diaries}
                onOpen={handleOpenDiary}
                onNewDiary={() => setMNewDiary(true)}
                onViewAll={() => setMDiaryList(true)}
                dark={dark}
                textPrimary={textPrimary}
                bgPanel={bgPanel}
                borderColor={borderColor}
              />
            </div>
          </div>

          {/* Astro bar */}
          <div style={{
            background: bgPrimary,
            borderTop: `1px solid ${dark ? "rgba(255,255,255,.08)" : "#e8eaf0"}`,
            padding: "9px 18px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{zodiac.s}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#1a72c9" }}>
                {zodiac.n} · {MONTHS[TODAY.getMonth()]} {TODAY.getDate()}, {TODAY.getFullYear()}
              </div>
              <div style={{ fontSize: 10, color: textMuted, lineHeight: 1.45 }}>
                {zodiac.tips[TODAY.getDate() % zodiac.tips.length]}
              </div>
            </div>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: "#1a72c9",
              flexShrink: 0, animation: "pulse 2s ease-in-out infinite"
            }} />
          </div>

          {/* Blue accent bar */}
          <div style={{ height: 5, background: "linear-gradient(90deg,#1a72c9,#0d3d7a)" }} />

          {/* Legend */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 16,
            padding: "11px 18px", background: bgPrimary, flexWrap: "wrap"
          }}>
            {[
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#1a72c9"/></svg>,                                       label: "Start Date" },
              { shape: <svg width="22" height="14"><rect width="22" height="14" rx="3" fill="#c8dff5"/></svg>,                              label: "In Between" },
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#0d3d7a"/></svg>,                                       label: "End Date"   },
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="none" stroke="#1a72c9" strokeWidth="2"/></svg>,        label: "Today"      },
            ].map(({ shape, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 10, color: textMuted, whiteSpace: "nowrap"
              }}>
                {shape}{label}
              </div>
            ))}
          </div>
        </div>

        {/* Wall shadow cast beneath calendar */}
        <div style={{
          position: "absolute", bottom: -30, left: "5%", right: "5%", height: 30,
          background: dark
            ? "radial-gradient(ellipse at center, rgba(0,0,0,.28) 0%, transparent 72%)"
            : "radial-gradient(ellipse at center, rgba(60,40,10,.25) 0%, transparent 72%)",
          filter: "blur(10px)", pointerEvents: "none",
        }} />
      </div>

      <Toast msg={toast.msg} show={toast.show} />

      <Profile
        open={mProfile}
        onClose={() => setMProfile(false)}
        user={user}
        heroQ1={heroQ1}
        heroQ2={heroQ2}
        onSave={({ name, q1, q2 }) => {
          setUser(name);
          setHeroQ1(q1 || "One Placement");
          setHeroQ2(q2 || "can rewrite the story\nof generations");
          showToast("Profile saved!");
        }}
      />

      <NewDiaryModal
        open={mNewDiary}
        onClose={() => setMNewDiary(false)}
        onCreate={handleCreateDiary}
      />

      <DiaryListModal
        open={mDiaryList}
        onClose={() => setMDiaryList(false)}
        diaries={diary.diaries}
        onOpen={handleOpenDiary}
        onNewDiary={() => setMNewDiary(true)}
      />

      <DiaryWriteModal
        open={mDiaryWrite}
        onClose={() => setMDiaryWrite(false)}
        curDiary={diary.curDiary}
        curPage={diary.curPage}
        activePage={diary.activePage}
        onSwitchPage={diary.switchPage}
        onAddPage={diary.addPage}
        onSave={() => { diary.savePage(); showToast("Saved!"); }}
        onDelete={() => { const deleted = diary.deleteDiary(); return deleted; }}
        dark={dark}
      />
    </div>
  );
}
