/**
 * Diary.jsx — RESPONSIVE + FIXED
 *
 * Fixes:
 *  1. New page no longer pre-fills text from previous page — each page
 *     is properly isolated using a key on the textarea/contentEditable.
 *  2. Writing font changed to 'Nunito' for better legibility, keeping
 *     Caveat only for the title (decorative).
 *  3. Fully responsive across mobile / tablet / desktop.
 */

import { useState, useEffect, useRef } from "react";
import Modal, { modalInput, modalLabel, modalBtn } from "./Modal";
import { MON_SHORT, DIARY_EMOJIS, DIARY_COLORS } from "../utils/constants";
import { fmtDate, TODAY } from "../utils/dateUtils";

/* ── Small diary card in the right panel ────────────────────────────────── */
export function DiaryCard({ diaries, onOpen, onNewDiary, onViewAll, dark, textPrimary, bgPanel, borderColor, compact = false }) {
  return (
    <div style={{
      background: dark ? "#12172a" : "#fff",
      borderRadius:9,
      border:`1px solid ${dark?"rgba(255,255,255,.1)":"#e4e6ee"}`,
      padding: compact ? 7 : 10,
      boxShadow:"0 2px 8px rgba(0,0,0,.06)"
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom: compact ? 5 : 8 }}>
        <div style={{
          width:19, height:19, background:"#1a2e5c", borderRadius:3,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" rx="1.2" stroke="white" strokeWidth="1.3"/>
            <line x1="3.8" y1="1" x2="3.8" y2="11" stroke="white" strokeWidth="1.3"/>
          </svg>
        </div>
        <span style={{ fontSize: compact ? 10 : 11.5, fontWeight:800, color:textPrimary }}>My Diaries</span>
      </div>

      {/* Last 2 entries */}
      {diaries.slice(-2).reverse().map((d) => {
        const lp = d.pages[d.pages.length-1] || { date:"", text:"", title:"" };
        const parts = (lp.date||"").split("-");
        return (
          <div
            key={d.id}
            className="diary-entry"
            onClick={() => onOpen(d.id)}
            style={{
              background: dark?"#16192a":"#f6f8fc", borderRadius:7,
              padding: compact ? "5px 7px" : "7px 9px",
              display:"flex", alignItems:"center", gap:9, marginBottom:6,
              cursor:"pointer", transition:"all .15s", border:"1px solid transparent"
            }}>
            <div style={{ textAlign:"center", minWidth: compact ? 22 : 28 }}>
              <div style={{ fontSize: compact?14:17, fontWeight:900, color:"#1a72c9", lineHeight:1 }}>{parts[2]||"--"}</div>
              <div style={{ fontSize:7.5, fontWeight:800, color:"#1a72c9", letterSpacing:.6, textTransform:"uppercase" }}>
                {MON_SHORT[parseInt(parts[1]||1)-1]||""}
              </div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:8, color:"#aaa", marginBottom:1 }}>{lp.date||"new"}</div>
              <div style={{ fontSize: compact?9:10, color:textPrimary, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {lp.text||(lp.title||"(empty)")}
              </div>
            </div>
            <button style={{ fontSize:15, color:"#bbb", cursor:"pointer", lineHeight:1, background:"none", border:"none", padding:0, flexShrink:0, fontFamily:"inherit" }}>›</button>
          </div>
        );
      })}

      {diaries.length > 2 && (
        <button
          onClick={onViewAll}
          style={{
            fontSize:10, color:"#1a72c9", cursor:"pointer", textAlign:"center",
            padding:"3px 0", display:"block", fontWeight:700,
            background:"none", border:"none", width:"100%", fontFamily:"inherit"
          }}>View all diaries →</button>
      )}

      <button
        onClick={onNewDiary}
        style={{
          width:"100%", background:"none",
          border:"1.5px dashed rgba(26,114,201,.38)", borderRadius:7,
          padding: compact ? 4 : 5,
          fontSize: compact ? 8.5 : 9.5, color:"#1a72c9", cursor:"pointer",
          fontFamily:"'Nunito',sans-serif", fontWeight:800,
          transition:"all .2s", marginTop:4
        }}
        onMouseOver={(e) => e.currentTarget.style.background="rgba(26,114,201,.08)"}
        onMouseOut={(e)  => e.currentTarget.style.background="none"}>
        ＋ New Diary
      </button>
    </div>
  );
}

/* ── New Diary Modal ─────────────────────────────────────────────────────── */
export function NewDiaryModal({ open, onClose, onCreate }) {
  const [ndName,  setNdName]  = useState("");
  const [ndEmoji, setNdEmoji] = useState("📒");
  const [ndColor, setNdColor] = useState("#1a72c9");

  const handleCreate = () => {
    onCreate({ name:ndName, emoji:ndEmoji, color:ndColor });
    setNdName(""); setNdEmoji("📒"); setNdColor("#1a72c9");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="📖 New Diary">
      <label style={modalLabel}>Diary Name</label>
      <input
        style={modalInput} value={ndName}
        onChange={(e) => setNdName(e.target.value)}
        placeholder="e.g. My DSA Journey" maxLength={40} />

      <label style={modalLabel}>Pick an Emoji</label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:5 }}>
        {DIARY_EMOJIS.map((em) => (
          <span key={em} onClick={() => setNdEmoji(em)} style={{
            fontSize:20, cursor:"pointer", padding:"3px 5px", borderRadius:5,
            display:"inline-block", transition:"background .2s",
            background: ndEmoji===em ? "rgba(26,114,201,.15)" : "transparent",
            border: ndEmoji===em ? "1.5px solid #1a72c9" : "1.5px solid transparent"
          }}>{em}</span>
        ))}
      </div>
      <input
        style={{ ...modalInput, width:70, textAlign:"center", fontSize:18, marginTop:7 }}
        value={ndEmoji}
        onChange={(e) => setNdEmoji(e.target.value)}
        maxLength={4} placeholder="Or type emoji..." />

      <label style={modalLabel}>Color Theme</label>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
        {DIARY_COLORS.map((c) => (
          <div key={c} onClick={() => setNdColor(c)} style={{
            width:22, height:22, borderRadius:"50%", background:c,
            cursor:"pointer", flexShrink:0,
            border: ndColor===c ? "2.5px solid #000" : "2.5px solid transparent",
            transform: ndColor===c ? "scale(1.15)" : "scale(1)",
            transition:"all .15s"
          }}/>
        ))}
      </div>
      <button className="mbtn-hover" style={modalBtn()} onClick={handleCreate}>Create Diary ✨</button>
      <button style={modalBtn(false,true)} onClick={onClose}>Cancel</button>
    </Modal>
  );
}

/* ── Diary List Modal ────────────────────────────────────────────────────── */
export function DiaryListModal({ open, onClose, diaries, onOpen, onNewDiary }) {
  return (
    <Modal open={open} onClose={onClose} title="📚 All Diaries">
      {!diaries.length ? (
        <div style={{ textAlign:"center", color:"#aaa", fontSize:13, padding:"24px 0" }}>
          No diaries yet. Create your first one!
        </div>
      ) : diaries.map((d) => (
        <div key={d.id}
          onClick={() => { onClose(); setTimeout(() => onOpen(d.id), 200); }}
          style={{
            display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
            borderRadius:9, border:"1.5px solid #e4e6ee", marginBottom:7,
            cursor:"pointer", transition:"all .15s", background:"#f8f9fc"
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor="#1a72c9"; e.currentTarget.style.background="rgba(26,114,201,.05)"; }}
          onMouseOut={(e)  => { e.currentTarget.style.borderColor="#e4e6ee"; e.currentTarget.style.background="#f8f9fc"; }}>
          <div style={{
            width:34, height:40, borderRadius:5, display:"flex",
            alignItems:"center", justifyContent:"center", fontSize:18,
            flexShrink:0, background:`${d.color}22`, border:`1.5px solid ${d.color}44`
          }}>{d.cover}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:800, color:"#1a1a2e" }}>{d.name}</div>
            <div style={{ fontSize:10, color:"#888" }}>
              {d.pages.length} page{d.pages.length!==1?"s":""} · Last {d.pages[d.pages.length-1]?.date||"—"}
            </div>
          </div>
          <div style={{ color:"#bbb", fontSize:16, transition:"color .15s" }}>›</div>
        </div>
      ))}
      <button className="mbtn-hover" style={modalBtn()}
        onClick={() => { onClose(); setTimeout(onNewDiary,200); }}>
        ＋ Create New Diary
      </button>
    </Modal>
  );
}

/* ── Diary Write Modal ───────────────────────────────────────────────────── */
export function DiaryWriteModal({ open, onClose, curDiary, curPage, activePage, onSwitchPage, onAddPage, onSave, onDelete, dark }) {
  if (!curDiary) return null;

  /*
   * FIX: Use controlled refs per page so switching pages
   * correctly resets the textarea/title — no stale DOM content.
   * Key the contentEditable title and textarea on activePage so
   * React fully remounts them when the page changes.
   */
  const titleRef = useRef(null);
  const textRef  = useRef(null);

  // Sync DOM title when activePage or curPage changes
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerText = curPage?.title || "";
    }
    if (textRef.current) {
      textRef.current.value = curPage?.text || "";
    }
  }, [activePage, curPage]);

  return (
    <Modal
      open={open}
      onClose={() => { onSave(); onClose(); }}
      title={`${curDiary.cover} ${curDiary.name}`}>

      {/* Page tabs */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
        {curDiary.pages.map((_,i) => (
          <div key={i} onClick={() => onSwitchPage(i)} style={{
            padding:"3px 10px", borderRadius:12, fontSize:10.5, fontWeight:800,
            cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .15s",
            border:`1.5px solid ${i===activePage ? curDiary.color : "#e4e6ee"}`,
            background: i===activePage ? curDiary.color : "#f8f9fc",
            color: i===activePage ? "#fff" : "#444"
          }}>p.{i+1}</div>
        ))}
      </div>

      {/* Paper — key resets DOM when page changes */}
      <div key={`page-${activePage}`} style={{
        background: dark?"#22200e":"#f5dfc0", borderRadius:12,
        padding:"20px 18px 18px 22px", position:"relative",
        minHeight:260, overflow:"hidden",
        borderTop:`4px solid ${curDiary.color}`
      }}>
        <div style={{ position:"absolute",top:4,left:0,right:0,height:8, background:"linear-gradient(90deg,#e0c898,#c8a860,#e0c898)", zIndex:2 }}/>
        <div style={{ position:"absolute",left:44,top:0,bottom:0,width:1.5,background:"rgba(210,80,80,.25)" }}/>
        <div style={{ position:"absolute",left:12,right:12,top:30,bottom:10, display:"flex",flexDirection:"column",gap:28, pointerEvents:"none" }}>
          {Array.from({length:9}).map((_,i) => (
            <div key={i} style={{ height:.5, background:"rgba(160,140,110,.32)" }}/>
          ))}
        </div>

        <div style={{ position:"relative", zIndex:1, paddingLeft:18 }}>
          {/* Date stamp */}
          <div style={{ fontSize:10.5, fontWeight:700, color: dark?"rgba(200,160,100,.65)":"rgba(90,64,48,.65)", marginBottom:2 }}>
            {curPage?.date || fmtDate(TODAY)}
          </div>

          {/* Title — Caveat for decorative heading */}
          <div
            ref={titleRef}
            id="dptitle_live"
            contentEditable
            suppressContentEditableWarning
            style={{
              fontFamily:"'Caveat',cursive", fontSize:"clamp(14px,3vw,17px)", fontWeight:700,
              color: dark?"#d4a050":"#5a4030", marginBottom:8,
              outline:"none", minWidth:60, display:"inline-block",
              letterSpacing:.2
            }}>
            {curPage?.title||""}
          </div>

          {/*
           * FIX: textarea uses defaultValue (uncontrolled) with a key reset.
           * When activePage changes, the component remounts via the parent key
           * and defaultValue renders the fresh page text correctly.
           *
           * FONT FIX: Changed from Caveat → Nunito for much better readability.
           * Caveat is a hand-drawn script that is decorative but hard to read
           * at body size. Nunito gives a warm, friendly feel while staying legible.
           */}
          <textarea
            ref={textRef}
            id="dptarea_live"
            rows={8}
            defaultValue={curPage?.text || ""}
            placeholder="Write your thoughts here..."
            style={{
              fontFamily:"'Nunito', sans-serif",
              fontSize:"clamp(12px,2.2vw,14px)",
              fontWeight:500,
              color: dark?"#d4b878":"#4a3520",
              background:"transparent",
              border:"none", outline:"none", resize:"none",
              width:"100%", minHeight:175, lineHeight:1.9,
              letterSpacing:.1,
            }}
          />
        </div>

        {/* Ghost date watermark */}
        <div style={{
          position:"absolute", bottom:10, right:14, fontSize:"clamp(36px,9vw,58px)",
          opacity:.055, fontFamily:"'DM Serif Display',serif", fontStyle:"italic",
          pointerEvents:"none", userSelect:"none",
          color: dark?"#a08040":"#8a6030", lineHeight:1
        }}>
          {(curPage?.date||"").split("-")[2]||""}
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
        <button className="mbtn-hover" style={{ ...modalBtn(), flex:1, marginTop:0 }} onClick={onAddPage}>＋ New Page</button>
        <button style={{ ...modalBtn(false,true), flex:1, marginTop:0, padding:"11px 8px" }} onClick={() => { onSave(); }}>💾 Save</button>
      </div>
      <button style={modalBtn(true)} onClick={() => { if (onDelete()) onClose(); }}>🗑 Delete This Diary</button>
    </Modal>
  );
}