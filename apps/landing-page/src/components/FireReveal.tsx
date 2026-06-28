"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   FireReveal — Intro Cinemático do Vibester

   Sequência:
   1. Tela preta → logo aparece com fade + glow
   2. Logo brilha com intensidade
   3. Logo some (scale up + fade) enquanto fundo preto permanece
   4. Fundo preto faz fade → site aparece desfocado → foca
   
   IMPORTANTE: children são SEMPRE renderizados no mesmo
   wrapper pra evitar remount do React.
   ═══════════════════════════════════════════════════════════ */

export default function FireReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"logoIn" | "hold" | "logoOut" | "siteIn" | "done">("logoIn");

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("hold"), 1000),
      window.setTimeout(() => setPhase("logoOut"), 2200),
      // Logo já sumiu → agora revela o site (fundo preto some + site desfoca→foca)
      window.setTimeout(() => setPhase("siteIn"), 2700),
      window.setTimeout(() => setPhase("done"), 3600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  console.log("FireReveal phase:", phase);

  return (
    <>
      <style>{`
        @keyframes logoFadeIn {
          0%   { opacity: 0; transform: scale(0.92); filter: blur(12px) drop-shadow(0 0 0 transparent); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px) drop-shadow(0 0 40px rgba(255,69,0,0.6)); }
        }
        @keyframes logoHold {
          0%   { filter: drop-shadow(0 0 40px rgba(255,69,0,0.6)); }
          50%  { filter: drop-shadow(0 0 60px rgba(255,69,0,0.9)) drop-shadow(0 0 120px rgba(255,140,0,0.4)); }
          100% { filter: drop-shadow(0 0 40px rgba(255,69,0,0.6)); }
        }
        @keyframes logoExit {
          0%   { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 40px rgba(255,69,0,0.6)); }
          100% { opacity: 0; transform: scale(1.2); filter: drop-shadow(0 0 80px rgba(255,69,0,0.9)); }
        }
        @keyframes siteUnblur {
          0%   { filter: blur(14px) brightness(0.5); opacity: 0.3; }
          100% { filter: blur(0px) brightness(1); opacity: 1; }
        }
        @keyframes bgFadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Children SEMPRE renderizados — nunca remonta */}
      <div
        style={
          phase === "done"
            ? undefined
            : phase === "siteIn"
            ? { animation: "siteUnblur 0.9s ease-out forwards" }
            : { opacity: 0, pointerEvents: "none" as const }
        }
      >
        {children}
      </div>

      {/* ══ FUNDO PRETO — camada separada da logo ══
          Fica até a fase siteIn, depois faz fade out */}
      {phase !== "done" && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none bg-[#050505]"
          style={{
            animation: phase === "siteIn" ? "bgFadeOut 0.9s ease-out forwards" : "none",
          }}
        />
      )}

      {/* ══ LOGO — camada acima do fundo ══ */}
      {(phase === "logoIn" || phase === "hold" || phase === "logoOut") && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          <div
            className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px]"
            style={{
              animation:
                phase === "logoIn"
                  ? "logoFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                  : phase === "hold"
                  ? "logoHold 1.2s ease-in-out infinite"
                  : "logoExit 0.5s ease-in forwards",
            }}
          >
            <img
              src="/logo-vibester.svg"
              alt="Vibester"
              className="w-full h-auto"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
