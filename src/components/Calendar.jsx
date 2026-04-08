import { MONTHS, DAYS_SHORT } from "../utils/constants";
import { TODAY } from "../utils/dateUtils";

export default function Calendar({
  yr, mo, cells,
  prevMonth, nextMonth,
  handleDayClick,
  isStart, isEnd, isInRange, isToday,
  dark, textPrimary, textMuted,
}) {
  return (
    <div style={{ padding: "16px 18px 12px" }}>
      {/* Month navigator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: textPrimary, letterSpacing: .4 }}>
          {MONTHS[mo].toUpperCase()} {yr}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {[{ arrow: "◀", action: prevMonth, primary: false }, { arrow: "▶", action: nextMonth, primary: true }].map(({ arrow, action, primary }) => (
            <button
              key={arrow}
              onClick={action}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                border: primary ? "1px solid transparent" : "1px solid #ccc",
                background: primary ? "#1a72c9" : "#f5f5f5",
                cursor: "pointer", fontSize: 9,
                color: primary ? "#fff" : "#666",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", fontFamily: "inherit",
                boxShadow: primary ? "0 3px 10px rgba(26,114,201,.4)" : "none"
              }}
            >{arrow}</button>
          ))}
        </div>
      </div>

      {/* Day-of-week headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7,1fr)",
        background: dark ? "#16192a" : "#f6f8fc", borderRadius: 7, padding: "5px 0", marginBottom: 3
      }}>
        {DAYS_SHORT.map((d, i) => (
          <div key={d} style={{
            textAlign: "center", fontSize: 9, fontWeight: 800, letterSpacing: .55,
            color: i === 0 || i === 6 ? "#1a72c9" : textMuted
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
        {cells.map((cell, idx) => {
          const dow = idx % 7;
          const dt  = cell.cur ? (() => { const d = new Date(yr, mo, cell.d); d.setHours(0,0,0,0); return d; })() : null;

          const start  = isStart(dt);
          const end    = isEnd(dt);
          const inRange = isInRange(dt);
          const today  = isToday(dt);
          const weekend = dow === 0 || dow === 6;

          return (
            <div
              key={idx}
              className="day-cell"
              onClick={() => cell.cur && dt && handleDayClick(dt)}
              style={{
                height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: cell.cur ? "pointer" : "default",
                background: inRange ? "rgba(26,114,201,.11)" : "transparent",
                position: "relative"
              }}
            >
              <div
                className={`day-num${!cell.cur ? " oth" : start ? " stt" : end ? " end" : today ? " tod" : ""}`}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600, transition: "all .15s", userSelect: "none",
                  color: !cell.cur
                    ? dark ? "#333" : "#ccc"
                    : start || end ? "#fff"
                    : today ? "#1a72c9"
                    : weekend ? "#1a72c9"
                    : textPrimary,
                  background: start ? "#1a72c9" : end ? "#0d3d7a" : "transparent",
                  border: today && !start && !end ? "2px solid #1a72c9" : "none",
                  boxShadow: start
                    ? "0 3px 12px rgba(26,114,201,.45)"
                    : end
                    ? "0 3px 12px rgba(13,61,122,.4)"
                    : "none"
                }}
              >{cell.d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}