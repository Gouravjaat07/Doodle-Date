/**
 * RealisticWallBackground.jsx — RESPONSIVE
 * Wall base color pixel-sampled from Calendar_Bg_Color.png
 * Fully responsive: mobile (≤480px), tablet (481–768px), laptop (769–1200px), desktop (1200px+)
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
      padding: "clamp(40px, 8vw, 100px) clamp(8px, 3vw, 20px) clamp(40px, 6vw, 80px)",
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

        /* ── Responsive breakpoints ── */
        @media (max-width: 480px) {
          .cal-grid { grid-template-columns: 1fr !important; }
          .cal-right-panel { display: none !important; }
          .cal-body { grid-template-columns: 1fr !important; }
          .legend-wrap { gap: 8px !important; padding: 8px 10px !important; flex-wrap: wrap; }
          .legend-item { font-size: 8px !important; }
          .astro-bar { padding: 7px 10px !important; }
          .astro-name { font-size: 10px !important; }
          .astro-tip  { font-size: 8.5px !important; }
          .brand-overlay { padding: 0 10px !important; top: 30px !important; }
          .hero-section { height: 140px !important; }
          .modal-inner  { padding: 18px 14px !important; }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .cal-right-panel { width: 160px !important; }
          .hero-section { height: 170px !important; }
          .brand-overlay { padding: 0 14px !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .cal-right-panel { width: 185px !important; }
        }
      `}</style>

      {/* WALL LAYERS */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background: dark
          ? "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,240,200,.03) 0%, transparent 70%)"
          : "radial-gradient(ellipse 75% 60% at 15% 10%, rgba(255,248,230,.80) 0%, rgba(240,225,195,.45) 40%, transparent 72%)"
      }}/>
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background: dark
          ? "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(0,0,0,.22) 0%, transparent 75%)"
          : "radial-gradient(ellipse 110% 60% at 65% 50%, rgba(140,118,90,.14) 0%, transparent 75%)"
      }}/>
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",
        background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, ${dark?"rgba(0,0,0,.55)":"rgba(80,60,35,.32)"} 100%)`
      }}/>
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none", opacity: dark?0.30:0.26,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat:"repeat", backgroundSize:"240px 240px", mixBlendMode: dark?"multiply":"soft-light"
      }}/>
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none", opacity: dark?0.12:0.10,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9 0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23h)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat:"repeat", backgroundSize:"180px 180px", mixBlendMode:"overlay"
      }}/>
      <div style={{ position:"fixed",zIndex:0,pointerEvents:"none", top:"-20%",left:"-25%",width:"85%",height:"85%",
        background: dark?"none":`conic-gradient(from 138deg at 20% 16%, rgba(255,248,218,.22) 0deg, rgba(255,235,170,.10) 20deg, transparent 42deg)`,
        filter:"blur(45px)", transform:"rotate(-8deg)"
      }}/>

      {/* Leaf shadows */}
      {[
        { t:"-6%",l:"-12%",w:"52%",h:"62%", tf:"rotate(-38deg) skewX(-12deg)", blur:18, op:0.92,
          bg: dark?"radial-gradient(ellipse 60% 80% at 55% 35%, rgba(0,0,0,.55) 0%, transparent 65%)":"radial-gradient(ellipse 60% 80% at 55% 35%, rgba(28,45,18,.30) 0%, transparent 65%)" },
        { t:"2%",l:"-8%",w:"38%",h:"48%", tf:"rotate(-28deg) skewX(-6deg)", blur:14, op:0.88,
          bg: dark?"radial-gradient(ellipse 55% 90% at 42% 28%, rgba(0,0,0,.45) 0%, transparent 60%)":"radial-gradient(ellipse 55% 90% at 42% 28%, rgba(20,38,14,.25) 0%, transparent 60%)" },
        { t:"-4%",l:"4%",w:"28%",h:"55%", tf:"rotate(-52deg) skewY(8deg)", blur:11, op:0.78,
          bg: dark?"radial-gradient(ellipse 30% 100% at 48% 18%, rgba(0,0,0,.42) 0%, transparent 55%)":"radial-gradient(ellipse 30% 100% at 48% 18%, rgba(24,42,16,.24) 0%, transparent 55%)" },
        { t:"8%",l:"-4%",w:"45%",h:"38%", tf:"rotate(-18deg)", blur:20, op:0.72,
          bg: dark?"radial-gradient(ellipse 80% 60% at 38% 45%, rgba(0,0,0,.38) 0%, transparent 58%)":"radial-gradient(ellipse 80% 60% at 38% 45%, rgba(18,36,12,.20) 0%, transparent 58%)" },
        { t:"0%",l:"8%",w:"14%",h:"68%", tf:"rotate(-42deg)", blur:7, op:0.68,
          bg: dark?"radial-gradient(ellipse 40% 100% at 50% 10%, rgba(0,0,0,.52) 0%, transparent 70%)":"radial-gradient(ellipse 40% 100% at 50% 10%, rgba(14,32,8,.32) 0%, transparent 70%)" },
        { t:"38%",l:"-6%",w:"30%",h:"28%", tf:"rotate(-8deg) skewX(10deg)", blur:16, op:0.62,
          bg: dark?"radial-gradient(ellipse 70% 50% at 60% 30%, rgba(0,0,0,.32) 0%, transparent 55%)":"radial-gradient(ellipse 70% 50% at 60% 30%, rgba(20,40,12,.18) 0%, transparent 55%)" },
        { t:"-18%",l:"-22%",w:"68%",h:"72%", tf:"none", blur:35, op:1,
          bg: dark?"radial-gradient(ellipse 70% 70% at 50% 40%, rgba(0,0,0,.18) 0%, transparent 70%)":"radial-gradient(ellipse 70% 70% at 50% 40%, rgba(10,28,6,.12) 0%, transparent 70%)" },
        { t:"-2%",l:"14%",w:"22%",h:"50%", tf:"rotate(-62deg) skewY(-5deg)", blur:9, op:0.58,
          bg: dark?"radial-gradient(ellipse 35% 100% at 50% 12%, rgba(0,0,0,.40) 0%, transparent 60%)":"radial-gradient(ellipse 35% 100% at 50% 12%, rgba(18,38,10,.22) 0%, transparent 60%)" },
        { t:"5%",l:"-2%",w:"18%",h:"35%", tf:"rotate(-30deg)", blur:22, op:0.82,
          bg: dark?"none":"radial-gradient(ellipse 50% 80% at 30% 20%, rgba(255,248,210,.14) 0%, transparent 60%)" },
        { t:"12%",l:"6%",w:"8%",h:"45%", tf:"rotate(-55deg)", blur:5, op:0.52,
          bg: dark?"radial-gradient(ellipse 50% 100% at 50% 5%, rgba(0,0,0,.48) 0%, transparent 60%)":"radial-gradient(ellipse 50% 100% at 50% 5%, rgba(10,26,6,.28) 0%, transparent 60%)" },
        { t:"25%",l:"-15%",w:"55%",h:"40%", tf:"none", blur:28, op:0.9,
          bg: dark?"radial-gradient(ellipse 100% 60% at 30% 50%, rgba(0,0,0,.12) 0%, transparent 65%)":"radial-gradient(ellipse 100% 60% at 30% 50%, rgba(8,20,4,.08) 0%, transparent 65%)" },
      ].map((l, i) => (
        <div key={i} style={{
          position:"fixed", zIndex:0, pointerEvents:"none",
          top:l.t, left:l.l, width:l.w, height:l.h,
          background:l.bg, transform:l.tf,
          filter:`blur(${l.blur}px)`, opacity:l.op
        }}/>
      ))}

      <div style={{ position:"fixed",zIndex:0,pointerEvents:"none", top:"20%",left:"30%",width:"55%",height:"50%",
        background: dark?"none":"radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,248,225,.16) 0%, transparent 70%)",
        filter:"blur(60px)"
      }}/>
      <div style={{ position:"fixed",bottom:0,left:0,right:0, height:"28%",zIndex:0,pointerEvents:"none",
        background: dark?"linear-gradient(to top, rgba(0,0,0,.28) 0%, transparent 100%)":"linear-gradient(to top, rgba(70,52,28,.12) 0%, transparent 100%)"
      }}/>

      {/* ── Content ── */}
      <div style={{ position:"relative", zIndex:1, width:"100%" }}>
        {children}
      </div>
    </div>
  );
}