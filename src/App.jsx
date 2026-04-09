import { useState, useEffect, useRef, useCallback } from "react";

import { TODAY, getZodiac, fmtDate } from "./utils/dateUtils";
import { MONTHS }                    from "./utils/constants";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useCalendar }     from "./hooks/useCalendar";
import { useDiary }        from "./hooks/useDiary";

import Toast                    from "./components/Toast";
import Onboarding               from "./components/Onboarding";
import Calendar                 from "./components/Calendar";
import Notes                    from "./components/Notes";
import Profile                  from "./components/Profile";
import RealisticBrandBar        from "./components/RealisticBrandBar";
import RealisticWallBackground  from "./components/RealisticWallBackground";
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

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <RealisticWallBackground dark={dark}>

      {/* ── Main scene ── */}
      <div style={{ position: "relative", zIndex: 1, width: 600, maxWidth: "100%", margin: "0 auto" }}>

        {/* ── Calendar card ── */}
        <div // Find the calendar card div and change its style:
          style={{
            background: "transparent",              // already correct
            borderRadius: "0 0 14px 14px",
            overflow: "visible",                    // ← change from "hidden" to "visible"
            boxShadow: dark
              ? "0 12px 40px rgba(0,0,0,.55), 0 40px 90px rgba(0,0,0,.35)"
              : "0 12px 40px rgba(40,25,8,.30), 0 40px 90px rgba(40,25,8,.18)",
            border: "none",                         // ← remove border entirely
            transform: `rotate(${sway}deg)`,
            transformOrigin: "50% 0",
            transition: "background .3s",
            // Fade the very top edge into the wall:
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 7%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 7%)",
          }}>

          {/* Brand bar */}
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
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg,rgba(0,0,0,.54) 0%,rgba(0,0,0,.15) 58%,transparent)",
              pointerEvents: "none"
            }} />
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
        <div // Replace the "Wall shadow cast beneath calendar" div style:
          style={{
            position: "absolute", bottom: -40, left: "3%", right: "3%", height: 40,
            background: dark
              ? "radial-gradient(ellipse at 48% 0%, rgba(0,0,0,.45) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 48% 0%, rgba(50,35,8,.38) 0%, transparent 70%)",
            filter: "blur(14px)",
            pointerEvents: "none",
            zIndex: 0,
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

    </RealisticWallBackground>
  );
}