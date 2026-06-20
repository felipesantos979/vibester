"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────────
   Features do painel B2B
   ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "📊",
    title: "Analytics Real-Time",
    desc: "Veja quantas pessoas estão no seu bar agora. Dados de fluxo, horários de pico e tendências semanais.",
    stat: "2.4k",
    statLabel: "visitas/semana",
  },
  {
    icon: "📅",
    title: "Gestão de Eventos",
    desc: "Crie eventos, promos e happy hours. Atraia o público certo para a noite certa.",
    stat: "+67%",
    statLabel: "mais público",
  },
  {
    icon: "👥",
    title: "Perfil do Público",
    desc: "Entenda quem frequenta seu bar. Faixa etária, frequência, preferências. Dados que viram estratégia.",
    stat: "18-35",
    statLabel: "faixa dominante",
  },
  {
    icon: "🚀",
    title: "Boost de Visibilidade",
    desc: "Destaque seu estabelecimento no mapa. Apareça primeiro quando a galera tiver decidindo pra onde ir.",
    stat: "3x",
    statLabel: "mais cliques",
  },
];

/* ─────────────────────────────────────────────
   Framer Motion variants
   ───────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ═══════════════════════════════════════════════
   B2BSection — Premium Business Panel
   ═══════════════════════════════════════════════ */
export default function B2BSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="b2b"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: "#060606" }}
    >
      {/* ── Background: Grid sutil ── */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Background: Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(255,69,0,0.07) 0%, transparent 55%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,140,0,0.04) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[15%] w-[350px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,69,0,0.04) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16 lg:mb-20"
        >
          {/* Tag */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4500]/8 border border-[#FF4500]/20 text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
            Para Estabelecimentos
          </span>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
            <span className="text-white">Dono de Estabelecimento?</span>
            <br />
            <span className="text-white">Você no controle da </span>
            <span className="text-gradient-fire">
              Vibe.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            <span className="text-gradient-fire drop-shadow-[0_0_20px_rgba(255,69,0,0.5)] font-bold block mb-1">
              Transforme dados em noites lotadas.
            </span>
            <span className="text-zinc-300">
              O painel administrador que você precisa.
            </span>
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-16"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500 hover:scale-[1.04] hover:-translate-y-1"
            >
              {/* Card bg com border gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-[1px]">
                <div className="absolute inset-[1px] rounded-2xl bg-[#0a0a0a]" />
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(255,69,0,0.12) 0%, transparent 60%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF4500] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 p-6 lg:p-7 flex flex-col h-full">
                {/* Icon container */}
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#FF4500]/8 border border-[#FF4500]/15 flex items-center justify-center text-2xl group-hover:bg-[#FF4500]/15 group-hover:border-[#FF4500]/30 group-hover:shadow-[0_0_25px_rgba(255,69,0,0.15)] transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF4500] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
                  {feature.desc}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-white/[0.06] flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#FF4500]">{feature.stat}</span>
                  <span className="text-zinc-600 text-xs font-medium">{feature.statLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <button className="group relative px-10 py-4 rounded-2xl border border-[#FF4500]/30 bg-[#FF4500]/5 text-white font-bold text-sm uppercase tracking-wider hover:bg-[#FF4500]/10 hover:border-[#FF4500]/50 hover:shadow-[0_0_40px_rgba(255,69,0,0.15)] transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden">
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4500]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              Acesse o Painel Admin
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
