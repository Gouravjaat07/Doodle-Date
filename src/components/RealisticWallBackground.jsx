/**
 * RealisticWallBackground.jsx
 *
 * Wall base color pixel-sampled directly from Bg-Color.png:
 *   Clean wall (right side, shadow-free): #e1c1b1
 *   Overall average:                      #c9ac9e
 *
 * Using #e1c1b1 as the base — this is the exact "lit" wall tone.
 * All shadow/gradient layers re-tuned to complement this warm rose-beige.
 */

import React from "react";

export default function RealisticWallBackground({ dark, children }) {
  const wallBase = dark ? "#1c1a18" : "#e1c1b1";

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "100px 20px 80px",
      overflow: "hidden",
      fontFamily: "'Nunito',sans-serif",
      transition: "background .4s",
      background: wallBase,
    }}>

      {/* ── LAYER 1 : warm sunlight bloom from top-left ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: dark
          ? "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,240,200,.03) 0%, transparent 70%)"
          : "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,248,235,.65) 0%, rgba(245,225,205,.38) 42%, transparent 72%)",
      }} />

      {/* ── LAYER 2 : mid-wall darker band ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: dark
          ? "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(0,0,0,.22) 0%, transparent 75%)"
          : "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(160,120,95,.13) 0%, transparent 75%)",
      }} />

      {/* ── LAYER 3 : edge vignette ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 100% 100% at 50% 50%,
          transparent 40%,
          ${dark ? "rgba(0,0,0,.55)" : "rgba(100,65,45,.28)"} 100%)`,
      }} />

      {/* ── LAYER 4 : micro grain / plaster texture ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        opacity: dark ? 0.30 : 0.22,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "240px 240px",
        mixBlendMode: dark ? "multiply" : "soft-light",
      }} />

      {/* ── LAYER 5 : secondary grain pass ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        opacity: dark ? 0.12 : 0.09,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9 0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23h)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }} />

      {/* ── LAYER 6 : directional sunlight streak from top-left ── */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "-20%", left: "-25%",
        width: "85%", height: "85%",
        background: dark
          ? "none"
          : `conic-gradient(
               from 138deg at 20% 16%,
               rgba(255,245,215,.20) 0deg,
               rgba(255,230,170,.08) 20deg,
               transparent 42deg)`,
        filter: "blur(45px)",
        transform: "rotate(-8deg)",
      }} />

      {/* ══════════════════════════════════════════════════════
          LEAF SHADOW SYSTEM — 11 organic layers
          Shadow rgba tuned for warm rose-beige base (#e1c1b1)
          ══════════════════════════════════════════════════════ */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>

        <div style={{
          position: "absolute", top: "-6%", left: "-12%", width: "52%", height: "62%",
          background: dark
            ? "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(0,0,0,.55) 0%, transparent 65%)"
            : "radial-gradient(ellipse 60% 80% at 55% 35%, rgba(110,65,40,.22) 0%, transparent 65%)",
          transform: "rotate(-38deg) skewX(-12deg)", filter: "blur(18px)", opacity: 0.90,
        }} />

        <div style={{
          position: "absolute", top: "2%", left: "-8%", width: "38%", height: "48%",
          background: dark
            ? "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(0,0,0,.45) 0%, transparent 60%)"
            : "radial-gradient(ellipse 55% 90% at 42% 28%, rgba(90,52,32,.20) 0%, transparent 60%)",
          transform: "rotate(-28deg) skewX(-6deg)", filter: "blur(14px)", opacity: 0.85,
        }} />

        <div style={{
          position: "absolute", top: "-4%", left: "4%", width: "28%", height: "55%",
          background: dark
            ? "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(0,0,0,.42) 0%, transparent 55%)"
            : "radial-gradient(ellipse 30% 100% at 48% 18%, rgba(100,60,38,.18) 0%, transparent 55%)",
          transform: "rotate(-52deg) skewY(8deg)", filter: "blur(11px)", opacity: 0.75,
        }} />

        <div style={{
          position: "absolute", top: "8%", left: "-4%", width: "45%", height: "38%",
          background: dark
            ? "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(0,0,0,.38) 0%, transparent 58%)"
            : "radial-gradient(ellipse 80% 60% at 38% 45%, rgba(85,50,30,.16) 0%, transparent 58%)",
          transform: "rotate(-18deg)", filter: "blur(20px)", opacity: 0.70,
        }} />

        <div style={{
          position: "absolute", top: "0%", left: "8%", width: "14%", height: "68%",
          background: dark
            ? "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(0,0,0,.52) 0%, transparent 70%)"
            : "radial-gradient(ellipse 40% 100% at 50% 10%, rgba(105,62,38,.24) 0%, transparent 70%)",
          transform: "rotate(-42deg)", filter: "blur(7px)", opacity: 0.65,
        }} />

        <div style={{
          position: "absolute", top: "38%", left: "-6%", width: "30%", height: "28%",
          background: dark
            ? "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(0,0,0,.32) 0%, transparent 55%)"
            : "radial-gradient(ellipse 70% 50% at 60% 30%, rgba(80,48,28,.14) 0%, transparent 55%)",
          transform: "rotate(-8deg) skewX(10deg)", filter: "blur(16px)", opacity: 0.60,
        }} />

        <div style={{
          position: "absolute", top: "-18%", left: "-22%", width: "68%", height: "72%",
          background: dark
            ? "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(0,0,0,.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 70% 70% at 50% 40%, rgba(70,40,22,.10) 0%, transparent 70%)",
          filter: "blur(35px)", opacity: 1,
        }} />

        <div style={{
          position: "absolute", top: "-2%", left: "14%", width: "22%", height: "50%",
          background: dark
            ? "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(0,0,0,.40) 0%, transparent 60%)"
            : "radial-gradient(ellipse 35% 100% at 50% 12%, rgba(95,55,35,.17) 0%, transparent 60%)",
          transform: "rotate(-62deg) skewY(-5deg)", filter: "blur(9px)", opacity: 0.55,
        }} />

        <div style={{
          position: "absolute", top: "5%", left: "-2%", width: "18%", height: "35%",
          background: dark
            ? "none"
            : "radial-gradient(ellipse 50% 80% at 30% 20%, rgba(255,245,215,.16) 0%, transparent 60%)",
          transform: "rotate(-30deg)", filter: "blur(22px)", opacity: 0.80,
        }} />

        <div style={{
          position: "absolute", top: "12%", left: "6%", width: "8%", height: "45%",
          background: dark
            ? "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(0,0,0,.48) 0%, transparent 60%)"
            : "radial-gradient(ellipse 50% 100% at 50% 5%, rgba(100,58,36,.22) 0%, transparent 60%)",
          transform: "rotate(-55deg)", filter: "blur(5px)", opacity: 0.50,
        }} />

        <div style={{
          position: "absolute", top: "25%", left: "-15%", width: "55%", height: "40%",
          background: dark
            ? "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(0,0,0,.12) 0%, transparent 65%)"
            : "radial-gradient(ellipse 100% 60% at 30% 50%, rgba(60,35,18,.07) 0%, transparent 65%)",
          filter: "blur(28px)", opacity: 0.9,
        }} />

      </div>

      {/* ── Warm light pool — centre wall bounce ── */}
      <div style={{
        position: "fixed", zIndex: 0, pointerEvents: "none",
        top: "20%", left: "30%", width: "55%", height: "50%",
        background: dark
          ? "none"
          : "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,240,220,.18) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* ── Floor ambient ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "28%", zIndex: 0, pointerEvents: "none",
        background: dark
          ? "linear-gradient(to top, rgba(0,0,0,.28) 0%, transparent 100%)"
          : "linear-gradient(to top, rgba(90,55,35,.10) 0%, transparent 100%)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}