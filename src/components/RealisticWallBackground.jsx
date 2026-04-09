/**
 * RealisticWallBackground.jsx
 *
 * Wall base color pixel-sampled directly from Calendar_Bg_Color.png:
 *   Exact wall color (peach-salmon): #e1c1b1  (light) / #1c1a18 (dark)
 *
 * All background-related layers extracted from App.jsx:
 *  - Wall base color
 *  - Google Fonts + global CSS
 *  - Sunlight bloom (top-left)
 *  - Mid-wall colour variation
 *  - Edge vignette
 *  - Micro grain (fractalNoise plaster texture)
 *  - Secondary grain pass
 *  - Directional sunlight streak
 *  - 11 leaf shadow layers
 *  - Warm light pool (centre bounce)
 *  - Floor ambient
 */

import React from "react";

export default function RealisticWallBackground({ dark, children }) {
  const wallBase = dark ? "#1c1a18" : "#e1c1b1";

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
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* ── Google Fonts + Global CSS ── */}
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

      {/* Layer 1 — warm sunlight bloom from top-left */}
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

      {/* Layer 3 — edge vignette */}
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
        top: "-20%", left: "-25%", width: "85%", height: "85%",
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
        top: "-6%", left: "-12%", width: "52%", height: "62%",
        background: dark
          ? "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(0,0,0,.55) 0%, transparent 65%)"
          : "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(28,45,18,.30) 0%, transparent 65%)",
        transform: "rotate(-38deg) skewX(-12deg)", filter: "blur(18px)", opacity: 0.92,
      }} />

      {/* Leaf 2 — secondary frond */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "2%", left: "-8%", width: "38%", height: "48%",
        background: dark
          ? "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(0,0,0,.45) 0%, transparent 60%)"
          : "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(20,38,14,.25) 0%, transparent 60%)",
        transform: "rotate(-28deg) skewX(-6deg)", filter: "blur(14px)", opacity: 0.88,
      }} />

      {/* Leaf 3 — thin pointed blade */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-4%", left: "4%", width: "28%", height: "55%",
        background: dark
          ? "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(0,0,0,.42) 0%, transparent 55%)"
          : "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(24,42,16,.24) 0%, transparent 55%)",
        transform: "rotate(-52deg) skewY(8deg)", filter: "blur(11px)", opacity: 0.78,
      }} />

      {/* Leaf 4 — broad rounded leaf */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "8%", left: "-4%", width: "45%", height: "38%",
        background: dark
          ? "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(0,0,0,.38) 0%, transparent 58%)"
          : "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(18,36,12,.20) 0%, transparent 58%)",
        transform: "rotate(-18deg)", filter: "blur(20px)", opacity: 0.72,
      }} />

      {/* Leaf 5 — sharp narrow stem shadow */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "0%", left: "8%", width: "14%", height: "68%",
        background: dark
          ? "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(0,0,0,.52) 0%, transparent 70%)"
          : "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(14,32,8,.32) 0%, transparent 70%)",
        transform: "rotate(-42deg)", filter: "blur(7px)", opacity: 0.68,
      }} />

      {/* Leaf 6 — small leaf tip, lower left */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "38%", left: "-6%", width: "30%", height: "28%",
        background: dark
          ? "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(0,0,0,.32) 0%, transparent 55%)"
          : "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(20,40,12,.18) 0%, transparent 55%)",
        transform: "rotate(-8deg) skewX(10deg)", filter: "blur(16px)", opacity: 0.62,
      }} />

      {/* Leaf 7 — soft diffused canopy */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-18%", left: "-22%", width: "68%", height: "72%",
        background: dark
          ? "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(0,0,0,.18) 0%, transparent 70%)"
          : "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(10,28,6,.12) 0%, transparent 70%)",
        filter: "blur(35px)", opacity: 1,
      }} />

      {/* Leaf 8 — diagonal cross-blade */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-2%", left: "14%", width: "22%", height: "50%",
        background: dark
          ? "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(0,0,0,.40) 0%, transparent 60%)"
          : "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(18,38,10,.22) 0%, transparent 60%)",
        transform: "rotate(-62deg) skewY(-5deg)", filter: "blur(9px)", opacity: 0.58,
      }} />

      {/* Leaf 9 — light leak gap */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "5%", left: "-2%", width: "18%", height: "35%",
        background: dark
          ? "none"
          : "radial-gradient(ellipse 50% 80% at 30% 20%, rgba(255,248,210,.14) 0%, transparent 60%)",
        transform: "rotate(-30deg)", filter: "blur(22px)", opacity: 0.82,
      }} />

      {/* Leaf 10 — fine twig line */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "12%", left: "6%", width: "8%", height: "45%",
        background: dark
          ? "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(0,0,0,.48) 0%, transparent 60%)"
          : "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(10,26,6,.28) 0%, transparent 60%)",
        transform: "rotate(-55deg)", filter: "blur(5px)", opacity: 0.52,
      }} />

      {/* Leaf 11 — ambient under-canopy scatter */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "25%", left: "-15%", width: "55%", height: "40%",
        background: dark
          ? "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(0,0,0,.12) 0%, transparent 65%)"
          : "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(8,20,4,.08) 0%, transparent 65%)",
        filter: "blur(28px)", opacity: 0.9,
      }} />

      {/* Warm light pool — bounce fill on centre wall */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "20%", left: "30%", width: "55%", height: "50%",
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

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}