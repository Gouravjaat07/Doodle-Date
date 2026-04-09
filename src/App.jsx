import { useState, useEffect, useRef, useCallback } from "react";

// Utils
import { TODAY, getZodiac, fmtDate } from "./utils/dateUtils";
import { MONTHS }                    from "./utils/constants";

// Hooks
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useCalendar }     from "./hooks/useCalendar";
import { useDiary }        from "./hooks/useDiary";

// Components
import Toast               from "./components/Toast";
import Onboarding          from "./components/Onboarding";
import Calendar            from "./components/Calendar";
import Notes               from "./components/Notes";
import Profile             from "./components/Profile";
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

  // Notes reset daily
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
    const animate = () => { t += 0.005; setSway(Math.sin(t) * 0.3); raf = requestAnimationFrame(animate); };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Modal visibility ────────────────────────────────────────────────── */
  const [mProfile,    setMProfile]    = useState(false);
  const [mNewDiary,   setMNewDiary]   = useState(false);
  const [mDiaryList,  setMDiaryList]  = useState(false);
  const [mDiaryWrite, setMDiaryWrite] = useState(false);

  /* ── Theme tokens ────────────────────────────────────────────────────── */
  const bgPrimary   = dark ? "#1a1f30" : "#fff";
  const bgWall      = dark
    ? "linear-gradient(160deg,#111318 0%,#181c24 40%,#141720 70%,#101318 100%)"
    : "linear-gradient(160deg,#ede7dc 0%,#ddd5c8 40%,#e4dcd0 70%,#d0c8ba 100%)";
  const textPrimary = dark ? "#e8eaf0" : "#1a1a2e";
  const textMuted   = dark ? "#666888" : "#8a8a9a";
  const bgPanel     = dark ? "#12172a" : "#f4f6fb";
  const borderColor = dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)";

  /* ── Note handlers ───────────────────────────────────────────────────── */
  const addNote    = ()      => setNotes((n) => [...n, ""]);
  const updateNote = (i, v)  => setNotes((n) => n.map((x, j) => j === i ? v : x));
  const deleteNote = (i)     => setNotes((n) => n.filter((_, j) => j !== i));

  /* ── Diary handlers ──────────────────────────────────────────────────── */
  const handleCreateDiary = (formData) => {
    const { id, list } = diary.createDiary({ ...formData, userName: user });
    setTimeout(() => { diary.openDiary(id, list); setMDiaryWrite(true); }, 200);
  };

  const handleOpenDiary = (id) => {
    diary.openDiary(id);
    setMDiaryWrite(true);
  };

  /* ── Zodiac ──────────────────────────────────────────────────────────── */
  const zodiac = getZodiac(TODAY);

  /* ── Onboarding gate ─────────────────────────────────────────────────── */
  if (!user) {
    return (
      <Onboarding
        onDone={(name) => setUser(name)}
      />
    );
  }

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: "100vh", background: bgWall,
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      padding: "100px 20px 80px", position: "relative", overflow: "hidden",
      transition: "background .4s", fontFamily: "'Nunito',sans-serif"
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(26,114,201,.3); border-radius: 2px; }
        .day-cell:hover .day-num:not(.stt):not(.end) { background: rgba(26,114,201,.12); transform: scale(1.08); }
        .note-row { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; }
        .note-del:hover { color: #e24b4a !important; }
        .diary-entry:hover { border-color: #1a72c9 !important; background: rgba(26,114,201,.06) !important; }
        .mbtn-hover:hover { background: #0d3d7a !important; transform: translateY(-1px); }
        .spiral-coil {
          width:15px; height:22px; border-radius:50%; border:2.5px solid #888;
          background:linear-gradient(135deg,#e4e4e4,#aaa);
          box-shadow:inset 0 1px 2px rgba(255,255,255,.5),0 1px 3px rgba(0,0,0,.25);
          margin-top:-6px; flex-shrink:0;
        }
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.6}}
      `}</style>

      {/* Wall texture */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "radial-gradient(circle,rgba(0,0,0,.033) 1px,transparent 1px)",
        backgroundSize: "18px 18px", pointerEvents: "none", zIndex: 0
      }} />

      {/* Leaf shadow */}
      <div style={{
        position: "fixed", top: -60, left: -80, width: 420, height: 420,
        background: "radial-gradient(ellipse,rgba(80,120,60,.1) 0%,transparent 65%)",
        transform: "rotate(-25deg)", pointerEvents: "none", zIndex: 0
      }} />

      {/* ── Scene ── */}
      <div style={{ position: "relative", zIndex: 1, width: 600, maxWidth: "100%" }}>

        {/* Nail */}
        <div style={{ position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "radial-gradient(circle at 33% 33%,#e8e8e8,#999 55%,#555)",
            boxShadow: "0 3px 8px rgba(0,0,0,.55),inset 0 1px 3px rgba(255,255,255,.4)",
            margin: "0 auto"
          }} />
          <div style={{
            width: 5, height: 30,
            background: "linear-gradient(180deg,#bbb,#888,#555)",
            margin: "0 auto", borderRadius: "0 0 3px 3px",
            boxShadow: "1px 0 4px rgba(0,0,0,.28)"
          }} />
        </div>

        {/* Hanging string */}
        <svg style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", zIndex: 45, width: 340, height: 76, overflow: "visible" }} viewBox="0 0 340 76" fill="none">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a6a50"/><stop offset="100%" stopColor="#5a4e38"/>
            </linearGradient>
          </defs>
          <path d="M170 5 Q90 10 44 68"  stroke="rgba(0,0,0,.16)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M170 5 Q250 10 296 68" stroke="rgba(0,0,0,.16)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M170 4 Q88 8 42 66"   stroke="url(#sg)" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M170 4 Q252 8 298 66"  stroke="url(#sg)" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>

        {/* Spiral strip */}
        <div style={{
          position: "absolute", top: -16, left: 14, right: 14, height: 24,
          background: "linear-gradient(180deg,#d4d4d4,#b6b6b6 50%,#cacaca)",
          borderRadius: "7px 7px 0 0", boxShadow: "0 -1px 5px rgba(0,0,0,.18)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 18px", zIndex: 20
        }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="spiral-coil" />
          ))}
        </div>

        {/* ── Calendar card ── */}
        <div style={{
          background: bgPrimary, borderRadius: "0 0 14px 14px", overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,.18),0 30px 70px rgba(0,0,0,.22),0 60px 120px rgba(0,0,0,.1)",
          border: `1px solid ${borderColor}`,
          transform: `rotate(${sway}deg)`, transformOrigin: "50% 0",
          transition: "background .3s,border-color .3s",
          backgroundImage: dark ? "none" : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E\")"
        }}>

          {/* Brand bar */}
          <div style={{
            padding: "13px 24px 10px", display: "flex", flexDirection: "column",
            alignItems: "center", borderBottom: `1px solid ${dark ? "rgba(255,255,255,.1)" : "#e8eaf0"}`,
            background: bgPrimary, position: "relative"
          }}>
            {/* User chip */}
            <button
              onClick={() => setMProfile(true)}
              style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                display: "flex", alignItems: "center", gap: 6,
                background: bgPanel, borderRadius: 20, padding: "3px 9px 3px 4px",
                border: `1.5px solid ${dark ? "rgba(255,255,255,.12)" : "#e4e6ee"}`,
                cursor: "pointer", maxWidth: 110, transition: "border-color .2s", fontFamily: "inherit"
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "#1a72c9"}
              onMouseOut={(e)  => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "#e4e6ee"}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "linear-gradient(135deg,#1a72c9,#0d3d7a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0
              }}>{(user || "U")[0].toUpperCase()}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 72 }}>
                {user || "User"}
              </span>
            </button>

            {/* Logo */}
            <div style={{ fontSize: 27, lineHeight: 1, fontFamily: "'DM Serif Display',Georgia,serif" }}>
              <span style={{ color: "#1a2e5c" }}>take</span>
              <span style={{ color: "#1a72c9", fontStyle: "italic" }}>U</span>
              <span style={{ color: "#1a2e5c" }}>forward</span>
            </div>
            <div style={{ width: 170, height: 1.5, background: "linear-gradient(90deg,transparent,#1a72c9 30%,#1a72c9 70%,transparent)", marginTop: 6 }} />

            {/* Dark toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: `1.5px solid ${dark ? "rgba(255,255,255,.12)" : "#e4e6ee"}`,
                borderRadius: 20, padding: "3px 9px", cursor: "pointer", fontSize: 13,
                transition: "border-color .2s", fontFamily: "inherit"
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "#1a72c9"}
              onMouseOut={(e)  => e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,.12)" : "#e4e6ee"}
            >{dark ? "☀️" : "🌙"}</button>
          </div>

          {/* Hero image */}
          <div style={{
            position: "relative", height: 218, overflow: "hidden",
            background: "linear-gradient(160deg,#1b3d6e,#2a6da8 35%,#5b9fcf 65%,#8fc5e0 85%,#c0ddf0)"
          }}>
            <img
              src="/Calendar_Main_Img.png"
              alt="hero"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", opacity: .88 }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.54) 0%,rgba(0,0,0,.15) 58%,transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 20, left: 26 }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#4db8ff", lineHeight: .65, marginBottom: 4, fontFamily: "'DM Serif Display',serif" }}>"</div>
              <div style={{ fontSize: 21, fontWeight: 800, color: "#fff", fontFamily: "'DM Serif Display',serif", lineHeight: 1.15, textShadow: "0 2px 10px rgba(0,0,0,.55)" }}>{heroQ1}</div>
              <div style={{ fontSize: 14, color: "rgba(240,246,255,.92)", fontFamily: "'DM Serif Display',serif", textShadow: "0 1px 6px rgba(0,0,0,.5)", lineHeight: 1.55, marginTop: 2 }}>
                {heroQ2.split("\n").map((l, i) => <span key={i}>{l}{i < heroQ2.split("\n").length - 1 && <br />}</span>)}
              </div>
              <div style={{ width: 86, height: 2.5, background: "#1a72c9", marginTop: 7, borderRadius: 2 }} />
            </div>
          </div>

          {/* Body: calendar + right panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>

            {/* Calendar */}
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

            {/* Right panel */}
            <div style={{
              background: bgPanel,
              borderLeft: `1px solid ${dark ? "rgba(255,255,255,.1)" : "#e8eaf0"}`,
              padding: "14px 12px 12px",
              display: "flex", flexDirection: "column", gap: 11
            }}>
              {/* Notes header */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, paddingBottom: 7, borderBottom: "2px solid #1a72c9" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#1a72c9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                    <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.4"/>
                    <line x1="3.5" y1="4.5" x2="9.5" y2="4.5" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="6.8" x2="9.5" y2="6.8" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="9" x2="7.5" y2="9" stroke="white" strokeWidth="1.1"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: textPrimary }}>Notes</span>
              </div>

              {/* Notepad */}
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

              {/* Diary card */}
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
            padding: "9px 18px", display: "flex", alignItems: "center", gap: 10
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
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a72c9", flexShrink: 0, animation: "pulse 2s ease-in-out infinite" }} />
          </div>

          {/* Blue accent bar */}
          <div style={{ height: 5, background: "linear-gradient(90deg,#1a72c9,#0d3d7a)" }} />

          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, padding: "11px 18px", background: bgPrimary, flexWrap: "wrap" }}>
            {[
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#1a72c9"/></svg>,               label: "Start Date" },
              { shape: <svg width="22" height="14"><rect width="22" height="14" rx="3" fill="#c8dff5"/></svg>,        label: "In Between" },
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#0d3d7a"/></svg>,               label: "End Date"   },
              { shape: <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="none" stroke="#1a72c9" strokeWidth="2"/></svg>, label: "Today" },
            ].map(({ shape, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: textMuted, whiteSpace: "nowrap" }}>
                {shape}{label}
              </div>
            ))}
          </div>
        </div>

        {/* Wall shadow */}
        <div style={{ position: "absolute", bottom: -28, left: "5%", right: "5%", height: 28, background: "radial-gradient(ellipse at center,rgba(0,0,0,.22) 0%,transparent 72%)", filter: "blur(10px)", pointerEvents: "none" }} />
      </div>

      {/* ── Toast ── */}
      <Toast msg={toast.msg} show={toast.show} />

      {/* ── Modals ── */}
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
