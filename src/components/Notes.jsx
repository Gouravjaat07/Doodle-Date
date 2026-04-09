/**
 * Notes.jsx — RESPONSIVE
 * Right-panel notepad with fluid sizing
 */
export default function Notes({
  quote, onQuoteChange, onQuoteBlur,
  notes, onAddNote, onUpdateNote, onDeleteNote,
  dark, textPrimary, compact = false,
}) {
  const quoteFontSize = compact ? 11 : 13;
  const noteFontSize  = compact ? 9  : 10;
  const padLeft       = compact ? 12 : 18;

  return (
    <div style={{
      borderRadius:9, overflow:"hidden",
      boxShadow:"3px 5px 18px rgba(0,0,0,.18)", flexShrink:0
    }}>
      <div style={{
        background: dark ? "#22200e" : "#f5dfc0",
        padding: compact ? `12px 8px 10px ${padLeft}px` : `16px 11px 12px ${padLeft}px`,
        position:"relative", minHeight: compact ? 100 : 160
      }}>
        {/* Top tape */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:7,
          background:"linear-gradient(90deg,#e0c898,#c8a860,#e0c898)",
          borderBottom:"1px solid rgba(0,0,0,.12)"
        }}/>
        {/* Red margin line */}
        <div style={{
          position:"absolute", left: compact ? 20 : 28, top:0, bottom:0,
          width:1, background:"rgba(210,80,80,.28)", pointerEvents:"none"
        }}/>
        {/* Ruled lines */}
        <div style={{
          position:"absolute", left:10, right:10, top:26, bottom:8,
          display:"flex", flexDirection:"column", justifyContent:"space-evenly",
          pointerEvents:"none"
        }}>
          {Array.from({ length: compact ? 6 : 9 }).map((_,i) => (
            <div key={i} style={{ height:.5, background:"rgba(160,140,110,.35)" }}/>
          ))}
        </div>

        <div style={{ position:"relative", zIndex:1, paddingLeft:6 }}>
          {/* Featured quote */}
          <textarea
            value={quote}
            onChange={(e) => onQuoteChange(e.target.value)}
            onBlur={onQuoteBlur}
            rows={2}
            placeholder="Your daily thought..."
            style={{
              fontFamily:"'Caveat',cursive", fontSize:quoteFontSize, fontWeight:600,
              color: dark?"#c8a050":"#5a4030", lineHeight:1.65,
              background:"transparent", border:"none", outline:"none",
              resize:"none", width:"100%", minHeight:44, marginTop:6, marginBottom:3
            }}
          />
          {/* Bullet notes */}
          {notes.map((n,i) => (
            <div key={i} className="note-row">
              <div style={{
                width:4, height:4, borderRadius:"50%", background:"#4a5a7c",
                flexShrink:0, marginTop:5
              }}/>
              <textarea
                value={n}
                onChange={(e) => onUpdateNote(i,e.target.value)}
                rows={1}
                style={{
                  fontSize:noteFontSize, color:textPrimary, lineHeight:1.4, flex:1,
                  background:"transparent", border:"none", outline:"none",
                  fontFamily:"'Nunito',sans-serif", resize:"none",
                  overflow:"hidden", height:"auto"
                }}
                onInput={(e) => {
                  e.target.style.height="auto";
                  e.target.style.height=e.target.scrollHeight+"px";
                }}
              />
              <button
                className="note-del"
                onClick={() => onDeleteNote(i)}
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:9, color:"#bbb", padding:0, transition:"color .2s", fontFamily:"inherit"
                }}>×</button>
            </div>
          ))}
          {/* Add note */}
          <button
            onClick={onAddNote}
            style={{
              background:"none", border:"1.5px dashed rgba(74,90,124,.45)",
              borderRadius:5, padding:"3px 7px", fontSize:9.5, color:"#5a6a8a",
              cursor:"pointer", fontFamily:"'Nunito',sans-serif", fontWeight:800,
              marginTop:2, transition:"all .2s"
            }}
            onMouseOver={(e) => { e.target.style.background="rgba(26,114,201,.08)"; e.target.style.borderColor="#1a72c9"; e.target.style.color="#1a72c9"; }}
            onMouseOut={(e)  => { e.target.style.background="none"; e.target.style.borderColor="rgba(74,90,124,.45)"; e.target.style.color="#5a6a8a"; }}>
            ＋ Add note
          </button>
        </div>
      </div>
    </div>
  );
}