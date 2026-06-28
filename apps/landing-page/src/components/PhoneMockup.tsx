import React from "react";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PhoneMockup — Premium iPhone-style device frame
 * Features: thick bezels, dynamic island notch, glass reflections,
 * strong fire glow, side buttons, and realistic depth shadows.
 */
export default function PhoneMockup({ children, className = "" }: PhoneMockupProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: 320, height: 660 }}
    >
      {/* ── Outer glow (fire aura) ── */}
      <div
        className="absolute -inset-6 rounded-[64px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,69,0,0.18) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Device body ── */}
      <div className="relative w-full h-full bg-black rounded-[52px] border-[6px] border-zinc-800/80 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.7),0_0_50px_rgba(255,69,0,0.12)]">

        {/* Inner bezel glow */}
        <div className="absolute inset-0 rounded-[46px] shadow-[inset_0_0_40px_rgba(255,69,0,0.06),inset_0_1px_0_rgba(255,255,255,0.06)] pointer-events-none z-50" />

        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-[20px] z-50 flex items-center justify-center gap-3 border border-zinc-800/40 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <div className="w-[8px] h-[8px] rounded-full bg-zinc-800 border border-zinc-700/30" />
          <div className="w-[6px] h-[6px] rounded-full bg-zinc-800 border border-zinc-700/20" />
        </div>

        {/* Screen area */}
        <div className="relative w-full h-full bg-[#050505] pt-[46px] overflow-hidden">
          {children}
        </div>

        {/* Glass reflection overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[46px] z-40 mix-blend-overlay"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 20%, transparent 50%)",
          }}
        />
      </div>

      {/* ── Side buttons ── */}
      {/* Silent switch */}
      <div className="absolute top-[90px] -left-[8px] w-[3px] h-[28px] bg-zinc-700 rounded-l-sm" />
      {/* Volume up */}
      <div className="absolute top-[135px] -left-[8px] w-[3px] h-[48px] bg-zinc-700 rounded-l-sm" />
      {/* Volume down */}
      <div className="absolute top-[195px] -left-[8px] w-[3px] h-[48px] bg-zinc-700 rounded-l-sm" />
      {/* Power */}
      <div className="absolute top-[160px] -right-[8px] w-[3px] h-[72px] bg-zinc-700 rounded-r-sm" />
    </div>
  );
}
