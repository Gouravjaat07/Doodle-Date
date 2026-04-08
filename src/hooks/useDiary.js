import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { fmtDate, TODAY } from "../utils/dateUtils";

/**
 * Manages all diary CRUD operations and page navigation.
 */
export function useDiary(showToast) {
  const [diaries, setDiaries] = useLocalStorage("tuf_diaries", []);
  const [activeDiaryId, setActiveDiaryId] = useState(null);
  const [activePage, setActivePage] = useState(0);

  const curDiary = diaries.find((d) => d.id === activeDiaryId);
  const curPage  = curDiary?.pages?.[activePage];

  /** Read live DOM values from the diary write modal and flush into state. */
  const savePage = useCallback(() => {
    setDiaries((prev) =>
      prev.map((d) => {
        if (d.id !== activeDiaryId) return d;
        const pages = [...d.pages];
        const titleEl = document.getElementById("dptitle_live");
        const textEl  = document.getElementById("dptarea_live");
        if (pages[activePage]) {
          pages[activePage] = {
            ...pages[activePage],
            title: titleEl?.innerText || titleEl?.textContent || pages[activePage].title,
            text:  textEl?.value || pages[activePage].text,
          };
        }
        return { ...d, pages };
      })
    );
  }, [activeDiaryId, activePage, setDiaries]);

  const createDiary = ({ name, emoji, color, userName }) => {
    const nm = name.trim() || `${userName}'s Diary`;
    const d = {
      id: Date.now() + "",
      name: nm,
      cover: emoji || "📒",
      color,
      pages: [{ date: fmtDate(TODAY), title: `Page 1 — ${fmtDate(TODAY)}`, text: "" }],
    };
    const updated = [...diaries, d];
    setDiaries(updated);
    showToast(`Diary "${nm}" created!`);
    return { id: d.id, list: updated };
  };

  const openDiary = (id, dlist = diaries) => {
    const d = dlist.find((x) => x.id === id);
    if (!d) return;
    setActiveDiaryId(id);
    setActivePage(d.pages.length - 1);
  };

  const addPage = () => {
    savePage();
    setDiaries((prev) =>
      prev.map((d) => {
        if (d.id !== activeDiaryId) return d;
        const pg = { date: fmtDate(TODAY), title: `Page ${d.pages.length + 1} — ${fmtDate(TODAY)}`, text: "" };
        return { ...d, pages: [...d.pages, pg] };
      })
    );
    setActivePage((p) => p + 1);
    showToast("New page added!");
  };

  const deleteDiary = () => {
    if (!window.confirm("Delete this diary? This cannot be undone.")) return false;
    setDiaries((prev) => prev.filter((d) => d.id !== activeDiaryId));
    showToast("Diary deleted.");
    return true;
  };

  const switchPage = (idx) => {
    savePage();
    setActivePage(idx);
  };

  return {
    diaries,
    curDiary,
    curPage,
    activeDiaryId,
    activePage,
    createDiary,
    openDiary,
    savePage,
    addPage,
    deleteDiary,
    switchPage,
  };
}