import { useState } from "react";
import { TODAY, buildCells, sameDay } from "../utils/dateUtils";

/**
 * Manages calendar navigation and range-selection state.
 */
export function useCalendar() {
  const [yr, setYr] = useState(TODAY.getFullYear());
  const [mo, setMo] = useState(TODAY.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [step, setStep] = useState(0); // 0 = waiting for start, 1 = waiting for end

  const prevMonth = () => {
    setMo((m) => {
      if (m === 0) { setYr((y) => y - 1); return 11; }
      return m - 1;
    });
  };

  const nextMonth = () => {
    setMo((m) => {
      if (m === 11) { setYr((y) => y + 1); return 0; }
      return m + 1;
    });
  };

  const handleDayClick = (dt) => {
    if (step === 0) {
      setRangeStart(dt);
      setRangeEnd(null);
      setStep(1);
    } else {
      let s = rangeStart, e = dt;
      if (e < s) [s, e] = [e, s];
      setRangeStart(s);
      setRangeEnd(e);
      setStep(0);
    }
  };

  const cells = buildCells(yr, mo);

  const isStart  = (dt) => dt && sameDay(dt, rangeStart);
  const isEnd    = (dt) => dt && rangeEnd && sameDay(dt, rangeEnd);
  const isInRange = (dt) => dt && rangeStart && rangeEnd && dt > rangeStart && dt < rangeEnd;
  const isToday  = (dt) => dt && sameDay(dt, TODAY);

  return {
    yr, mo,
    prevMonth, nextMonth,
    rangeStart, rangeEnd,
    handleDayClick,
    cells,
    isStart, isEnd, isInRange, isToday,
  };
}