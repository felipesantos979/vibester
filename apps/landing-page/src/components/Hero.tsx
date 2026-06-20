"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Atraso sincronizado com FireReveal (~2.7s pro site aparecer)
    const timer = setTimeout(() => setIsVisible(true), 2900);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      const x = (e.clientX / window.innerWidth - 0.5) * 40; // max 20px
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    }
  };

  const words = ["O", "FIM", "DA", "VIAGEM", "PERDIDA."];

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 bg-background"
    >
      <style>{`
        @keyframes slowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>

      {/* Interactive Radar Background - Wrapped for slow pulse */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ animation: "slowPulse 10s ease-in-out infinite" }}>
        <div 
          className="absolute inset-[-50px] radar-bg transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
      </div>

      {/* Center Deep Glow (5% opacity) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,69,0,0.05) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Breathing Gradient Orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,0,0.35) 0%, rgba(255,107,0,0.1) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Secondary glow */}
      <div className="absolute top-1/4 right-1/4 pointer-events-none z-0">
        <div
          className="w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,69,0,0.15) 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto mt-12">
        {/* Title with text reveal */}
        <h1 className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8">
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden"
            >
              <span
                className={`inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible
                    ? "translate-y-0 opacity-100 blur-0"
                    : "translate-y-full opacity-0 blur-md"
                }`}
                style={{ transitionDelay: `${i * 120 + 300}ms` }}
              >
                {word === "PERDIDA." ? (
                  <span className="text-gradient-fire">{word}</span>
                ) : (
                  word
                )}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed font-light transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 blur-0"
              : "translate-y-8 opacity-0 blur-md"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          A pergunta{" "}
          <span className="text-white font-medium">
            &ldquo;será que lá tá bom?&rdquo;
          </span>{" "}
          acabou.
          <br className="hidden sm:block" />
          Veja a vibe do rolê de dentro,{" "}
          <span className="text-fire font-medium">antes de sair de casa.</span>
        </p>

        {/* CTA Buttons (Framer Motion) */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 lg:mt-16"
        >
          {/* Botão Primário (Agora o Descubra a Vibe) */}
          <motion.a
            href="#problems"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative px-8 py-4 sm:px-10 rounded-2xl bg-gradient-to-r from-[#FF4500] to-[#FF6B00] text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,69,0,0.3)] hover:shadow-[0_0_50px_rgba(255,69,0,0.5)] transition-shadow duration-500 overflow-hidden flex items-center justify-center"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              Descubra a Vibe
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </motion.a>

          {/* Botão Secundário (Agora o Lista VIP) */}
          <motion.a
            href="#waitlist"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 sm:px-10 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-bold text-sm hover:bg-white/[0.08] hover:border-white/30 backdrop-blur-md transition-colors duration-500 flex items-center justify-center group"
          >
            <span className="flex items-center gap-3">
              Entrar na Lista VIP
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
