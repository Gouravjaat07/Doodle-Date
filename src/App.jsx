/**
 * App.jsx — FULLY RESPONSIVE
 *
 * Breakpoints:
 *   mobile  : ≤ 480px  → single column, right panel hidden, compact controls
 *   tablet  : 481–768px → two columns, narrower right panel
 *   laptop  : 769–1200px → standard layout
 *   desktop : > 1200px → standard layout, slightly more breathing room
 *
 * Diary fixes:
 *   - New page no longer shows previous page's text
 *   - Body font switched to Nunito for better readability
 */

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

/* ── Tiny responsive hook ────────────────────────────────────────────────── */
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

export default function App() {
  const { w } = useWindowSize();
  const isMobile  = w <= 480;
  const isTablet  = w > 480 && w <= 768;
  const isLaptop  = w > 768 && w <= 1200;
  const isDesktop = w > 1200;

  /* derived layout values */
  const maxW        = isMobile ? "100%" : isTablet ? 520 : isLaptop ? 600 : 640;
  const rightPanelW = isMobile ? 0 : isTablet ? 155 : isLaptop ? 195 : 210;
  const compact     = isMobile || isTablet;

  /* ── Persistent user state ────────────────────────────────────────────── */
  const [user,   setUser]   = useLocalStorage("tuf_user",  "");
  const [dark,   setDark]   = useLocalStorage("tuf_dark",  false);
  const [heroQ1, setHeroQ1] = useLocalStorage("tuf_hq1",   "One Placement");
  const [heroQ2, setHeroQ2] = useLocalStorage("tuf_hq2",   "can rewrite the story\nof generations");
  const [quote,  setQuote]  = useLocalStorage("tuf_quote", "Stay focused &\nkeep moving forward.");

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
  const [toast, setToast] = useState({ show:false, msg:"" });
  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast({ show:true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show:false })), 2200);
  }, []);

  /* ── Hooks ───────────────────────────────────────────────────────────── */
  const cal   = useCalendar();
  const diary = useDiary(showToast);

  /* ── Gentle sway animation ───────────────────────────────────────────── */
  const [sway, setSway] = useState(0);
  useEffect(() => {
    let t=0, raf;
    const animate = () => {
      t += 0.005;
      setSway(Math.sin(t) * (isMobile ? 0.15 : 0.3));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

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
  const addNote    = ()     => setNotes((n) => [...n, ""]);
  const updateNote = (i,v) => setNotes((n) => n.map((x,j) => j===i ? v : x));
  const deleteNote = (i)   => setNotes((n) => n.filter((_,j) => j!==i));

  /* ── Diary handlers ──────────────────────────────────────────────────── */
  const handleCreateDiary = (formData) => {
    const { id, list } = diary.createDiary({ ...formData, userName: user });
    setTimeout(() => { diary.openDiary(id, list); setMDiaryWrite(true); }, 200);
  };
  const handleOpenDiary = (id) => { diary.openDiary(id); setMDiaryWrite(true); };

  /* ── Zodiac ──────────────────────────────────────────────────────────── */
  const zodiac = getZodiac(TODAY);

  /* ── Hero height ─────────────────────────────────────────────────────── */
  const heroHeight = isMobile ? 130 : isTablet ? 165 : 218;

  /* ── Astro / Legend font sizes ───────────────────────────────────────── */
  const astroNameSize = isMobile ? 9.5 : 11.5;
  const astroTipSize  = isMobile ? 8   : 10;
  const legendFontSz  = isMobile ? 8   : 10;

  /* ── Onboarding gate ─────────────────────────────────────────────────── */
  if (!user) return <Onboarding onDone={(name) => setUser(name)} />;

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <RealisticWallBackground dark={dark}>

      <div style={{ position:"relative", zIndex:1, width:maxW, maxWidth:"100%", margin:"0 auto" }}>

        {/* ── Calendar card ── */}
        <div style={{
          background:"transparent",
          borderRadius:"0 0 14px 14px",
          overflow:"visible",
          boxShadow: dark
            ? "0 12px 40px rgba(0,0,0,.55), 0 40px 90px rgba(0,0,0,.35)"
            : "0 12px 40px rgba(40,25,8,.30), 0 40px 90px rgba(40,25,8,.18)",
          border:"none",
          transform: `rotate(${sway}deg)`,
          transformOrigin:"50% 0",
          transition:"background .3s",
          WebkitMaskImage:"linear-gradient(to bottom, transparent 0%, black 7%)",
          maskImage:"linear-gradient(to bottom, transparent 0%, black 7%)",
        }}>

          {/* Brand bar */}
          <RealisticBrandBar
            dark={dark}
            user={user}
            onProfileClick={() => setMProfile(true)}
            onDarkToggle={() => setDark((d) => !d)}
            compact={compact}
          />

          {/* Hero image */}
          <div className="hero-section" style={{
            position:"relative", height:heroHeight, overflow:"hidden",
            background:"linear-gradient(160deg,#1b3d6e,#2a6da8 35%,#5b9fcf 65%,#8fc5e0 85%,#c0ddf0)",
          }}>
            <img
              src="/images/Calendar_Main_Img.png"
              alt="hero"
              style={{
                position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center 28%", opacity:.88
              }}
              onError={(e) => { e.target.style.display="none"; }}
            />
            <div style={{
              position:"absolute", inset:0,
              background:"linear-gradient(90deg,rgba(0,0,0,.54) 0%,rgba(0,0,0,.15) 58%,transparent)",
              pointerEvents:"none"
            }}/>
          </div>

          {/* Body: calendar + right panel (hidden on mobile) */}
          <div className="cal-body" style={{
            display:"grid",
            gridTemplateColumns: isMobile ? "1fr" : `1fr ${rightPanelW}px`,
          }}>
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
              compact={compact}
            />

            {/* Right panel — hidden on mobile */}
            {!isMobile && (
              <div
                className="cal-right-panel"
                style={{
                  background:bgPanel,
                  borderLeft:`1px solid ${dark?"rgba(255,255,255,.1)":"#e8eaf0"}`,
                  padding: isTablet ? "10px 8px 10px" : "14px 12px 12px",
                  display:"flex", flexDirection:"column", gap: isTablet ? 8 : 11,
                  width: rightPanelW,
                }}>
                {/* Notes header */}
                <div style={{
                  display:"flex", alignItems:"center", gap:7,
                  paddingBottom:7, borderBottom:"2px solid #1a72c9"
                }}>
                  <div style={{
                    width:26, height:26, borderRadius:"50%", background:"#1a72c9",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                  }}>
                    <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                      <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.4"/>
                      <line x1="3.5" y1="4.5" x2="9.5" y2="4.5" stroke="white" strokeWidth="1.1"/>
                      <line x1="3.5" y1="6.8" x2="9.5" y2="6.8" stroke="white" strokeWidth="1.1"/>
                      <line x1="3.5" y1="9"   x2="7.5" y2="9"   stroke="white" strokeWidth="1.1"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: isTablet?10:12, fontWeight:800, color:textPrimary }}>Notes</span>
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
                  compact={isTablet}
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
                  compact={isTablet}
                />
              </div>
            )}
          </div>

          {/* Mobile-only: Notes + Diary below calendar */}
          {isMobile && (
            <div style={{
              background:bgPanel,
              borderTop:`1px solid ${dark?"rgba(255,255,255,.1)":"#e8eaf0"}`,
              padding:"12px 12px 12px",
              display:"flex", flexDirection:"column", gap:10,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, paddingBottom:6, borderBottom:"2px solid #1a72c9" }}>
                <div style={{
                  width:22, height:22, borderRadius:"50%", background:"#1a72c9",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>
                  <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                    <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="white" strokeWidth="1.4"/>
                    <line x1="3.5" y1="4.5" x2="9.5" y2="4.5" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="6.8" x2="9.5" y2="6.8" stroke="white" strokeWidth="1.1"/>
                    <line x1="3.5" y1="9"   x2="7.5" y2="9"   stroke="white" strokeWidth="1.1"/>
                  </svg>
                </div>
                <span style={{ fontSize:11, fontWeight:800, color:textPrimary }}>Notes & Diary</span>
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
                compact={true}
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
                compact={true}
              />
            </div>
          )}

          {/* Astro bar */}
          <div className="astro-bar" style={{
            background:bgPrimary,
            borderTop:`1px solid ${dark?"rgba(255,255,255,.08)":"#e8eaf0"}`,
            padding: isMobile ? "7px 12px" : "9px 18px",
            display:"flex", alignItems:"center", gap: isMobile ? 7 : 10,
          }}>
            <span style={{ fontSize: isMobile ? 16 : 20, flexShrink:0 }}>{zodiac.s}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="astro-name" style={{ fontSize:astroNameSize, fontWeight:800, color:"#1a72c9" }}>
                {zodiac.n} · {MONTHS[TODAY.getMonth()]} {TODAY.getDate()}, {TODAY.getFullYear()}
              </div>
              <div className="astro-tip" style={{ fontSize:astroTipSize, color:textMuted, lineHeight:1.45 }}>
                {zodiac.tips[TODAY.getDate() % zodiac.tips.length]}
              </div>
            </div>
            <div style={{
              width:6, height:6, borderRadius:"50%", background:"#1a72c9",
              flexShrink:0, animation:"pulse 2s ease-in-out infinite"
            }}/>
          </div>

          {/* Blue accent bar */}
          <div style={{ height:5, background:"linear-gradient(90deg,#1a72c9,#0d3d7a)" }}/>

          {/* Legend */}
          <div className="legend-wrap" style={{
            display:"flex", justifyContent:"center", gap: isMobile ? 8 : 16,
            padding: isMobile ? "8px 10px" : "11px 18px",
            background:bgPrimary, flexWrap:"wrap"
          }}>
            {[
              { shape:<svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#1a72c9"/></svg>,                                      label:"Start Date" },
              { shape:<svg width="22" height="14"><rect width="22" height="14" rx="3" fill="#c8dff5"/></svg>,                             label:"In Between" },
              { shape:<svg width="14" height="14"><circle cx="7" cy="7" r="7" fill="#0d3d7a"/></svg>,                                      label:"End Date"   },
              { shape:<svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="none" stroke="#1a72c9" strokeWidth="2"/></svg>,       label:"Today"      },
            ].map(({ shape, label }) => (
              <div key={label} className="legend-item" style={{
                display:"flex", alignItems:"center", gap:5,
                fontSize:legendFontSz, color:textMuted, whiteSpace:"nowrap"
              }}>
                {shape}{label}
              </div>
            ))}
          </div>
        </div>

        {/* Wall shadow */}
        <div style={{
          position:"absolute", bottom:-40, left:"3%", right:"3%", height:40,
          background: dark
            ? "radial-gradient(ellipse at 48% 0%, rgba(0,0,0,.45) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 48% 0%, rgba(50,35,8,.38) 0%, transparent 70%)",
          filter:"blur(14px)", pointerEvents:"none", zIndex:0,
        }}/>
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
          setHeroQ1(q1||"One Placement");
          setHeroQ2(q2||"can rewrite the story\nof generations");
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