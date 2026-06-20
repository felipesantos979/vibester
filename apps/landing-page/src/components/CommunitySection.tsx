"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, Variants } from "framer-motion";

/* ─────────────────────────────────────────────
   Dados dos stories/cards da community
   ───────────────────────────────────────────── */
const STORIES = [
  {
    id: 1,
    name: "Lucas M.",
    avatar: "🤘",
    avatarBg: "from-[#FF4500] to-[#FF6B00]",
    time: "há 3 min",
    image: "/vibe-story-1.png",
    text: "Tá LOTADO aqui no Firehouse 🔥 melhor noite do mês!",
    location: "Firehouse Lounge",
    crowd: "92%",
    tag: "Balada",
  },
  {
    id: 2,
    name: "Bia Santos",
    avatar: "🍹",
    avatarBg: "from-[#FF6B00] to-[#FF8C00]",
    time: "há 7 min",
    image: "/vibe-story-2.png",
    text: "Drinks insanos e a vista é demais! Rooftop perfeito 🌃",
    location: "Sky Lounge",
    crowd: "78%",
    tag: "Rooftop",
  },
  {
    id: 3,
    name: "Rafa Costa",
    avatar: "🎸",
    avatarBg: "from-[#FF8C00] to-[#FFA500]",
    time: "há 12 min",
    image: "/vibe-story-3.png",
    text: "Banda ao vivo destruindo tudo! Rock & cerveja artesanal 🍺",
    location: "Mister Rock Bar",
    crowd: "88%",
    tag: "Rock",
  },
  {
    id: 4,
    name: "Duda Alves",
    avatar: "🔥",
    avatarBg: "from-[#FF4500] to-[#CC3700]",
    time: "há 15 min",
    image: "/vibe-story-4.png",
    text: "O bartender acabou de fazer um drink com FOGO na frente 🤯",
    location: "Oficina PUB",
    crowd: "95%",
    tag: "Drinks",
  },
  {
    id: 5,
    name: "Pedro H.",
    avatar: "🎧",
    avatarBg: "from-[#FF6B00] to-[#FF4500]",
    time: "há 20 min",
    image: "/vibe-story-5.png",
    text: "DJ mandando set absurdo, pista CHEIA. Vem logo! 💃",
    location: "Club Neon",
    crowd: "97%",
    tag: "Eletrônica",
  },
  {
    id: 6,
    name: "Mari Duarte",
    avatar: "✨",
    avatarBg: "from-[#FFA500] to-[#FF8C00]",
    time: "há 25 min",
    image: "/vibe-story-6.png",
    text: "Luzinha, cerveja gelada e uma vibe incrível no jardim 🌿",
    location: "Garden Pub",
    crowd: "65%",
    tag: "Casual",
  },
];

/* ═══════════════════════════════════════════════
   Componente do Card com Tilt 3D
   ═══════════════════════════════════════════════ */
function TiltStoryCard({ story }: { story: typeof STORIES[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative w-[clamp(240px,22vw,320px)] rounded-3xl overflow-visible bg-[#0a0a0a] border border-white/[0.06] cursor-pointer flex-shrink-0"
    >
      {/* Glow Hover Layer */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF4500]/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#FF4500]/0 group-hover:ring-[#FF4500]/40 transition-all duration-500 shadow-[0_0_0_rgba(255,69,0,0)] group-hover:shadow-[0_0_40px_rgba(255,69,0,0.15)] pointer-events-none" />

      {/* Card Content com TranslateZ */}
      <div 
        style={{ transform: "translateZ(30px)" }} 
        className="flex flex-col h-full overflow-hidden rounded-3xl pointer-events-none"
      >
        {/* Imagem do story */}
        <div className="relative h-[clamp(100px,14vh,190px)] overflow-hidden pointer-events-auto">
          <img
            src={story.image}
            alt={story.text}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

          {/* Tag */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-[#FF4500]/30 text-[#FF4500] text-[9px] font-bold uppercase tracking-wider">
              {story.tag}
            </span>
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
              Live
            </span>
          </div>
        </div>

        {/* Informações */}
        <div className="p-[clamp(12px,2vh,20px)] space-y-[clamp(8px,1vh,16px)] relative bg-[#0a0a0a] pointer-events-auto">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${story.avatarBg} flex items-center justify-center text-sm shadow-lg ring-2 ring-black`}
            >
              {story.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">
                {story.name}
              </p>
              <p className="text-zinc-500 text-[11px] font-medium">
                {story.time}
              </p>
            </div>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed font-medium line-clamp-2">
            {story.text}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-[#FF4500]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-zinc-500 text-[11px] font-medium truncate max-w-[150px]">
                {story.location}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-[#FF4500]">🔥</span>
              <span className="text-zinc-400">{story.crowd}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   CommunitySection - Lando Norris Scatter-to-Grid
   ═══════════════════════════════════════════════ */
export default function CommunitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll inside this 300vh section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  // Background parallax glow
  const glowX = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"], { clamp: true });

  // CTA anima de 0.75 a 0.85 (depois que os cards chegam)
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1], { clamp: true });
  const ctaY = useTransform(scrollYProgress, [0.75, 0.85], [30, 0], { clamp: true });

  // Configuração individual de cada card para o efeito "diferentes velocidades"
  const CARD_CONFIGS = [
    { startX: 130, startProgress: 0.05 },
    { startX: 210, startProgress: 0.0 },
    { startX: 280, startProgress: 0.1 },
    { startX: 160, startProgress: 0.15 },
    { startX: 240, startProgress: 0.05 },
    { startX: 300, startProgress: 0.1 },
  ];

  return (
    <section
      ref={sectionRef}
      id="community"
      className="relative bg-[#050505]"
      style={{ height: "200vh" }} // Reduzido de 400vh para 200vh para um scroll mais dinâmico e sem espaço morto
    >
      {/* Alterado para justify-start e pt-24 para garantir que o título sempre fique no topo e nunca seja cortado em telas menores */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-start overflow-hidden z-10 pt-20 pb-6">
        
        {/* Background Gradient & Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0505] to-[#050505]" />
          <motion.div
            style={{ x: glowX }}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full"
            animate={{
              background: "radial-gradient(ellipse, rgba(255,69,0,0.06) 0%, transparent 60%)",
            }}
            transition={{ duration: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-10 w-full h-full flex flex-col">
          
          {/* ── Cabeçalho (Título) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-[clamp(16px,3vh,40px)] space-y-[clamp(8px,1.5vh,16px)] shrink-0"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] text-xs font-bold tracking-[0.25em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
              Ao Vivo
            </span>
            <h2 className="text-[clamp(2.5rem,6vh,4.5rem)] font-black tracking-tighter leading-[0.95]">
              A vibe tá <br className="sm:hidden" />
              <span className="text-gradient-fire">rolando agora!</span>
            </h2>
            <p className="text-zinc-400 text-[clamp(1rem,2vh,1.25rem)] max-w-2xl mx-auto leading-relaxed font-medium">
              Veja stories e check-ins da galera em tempo real.{" "}
              <span className="text-white">A vibe é coletiva.</span>
            </p>
          </motion.div>

          {/* ── Grid de Cards com Parallax Horizontal e Alinhamento Final ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(12px,2vh,32px)] justify-items-center overflow-visible flex-1 content-center">
            {STORIES.map((story, index) => {
              const config = CARD_CONFIGS[index];
              
              // 1. Pega o valor numérico puro do transform (Esticado até 0.8 do scroll para suavizar na altura menor)
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const cardXNum = useTransform(
                scrollYProgress, 
                [config.startProgress, 0.8], 
                [config.startX, 0],
                { clamp: true }
              );

              // 2. Aplica um efeito de mola (física) em cima do valor do scroll
              // Isso tira a "parada dura" e cria um overshoot (passa um pouquinho e volta)
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const springXNum = useSpring(cardXNum, {
                stiffness: 120, // Quão forte a mola puxa de volta
                damping: 14,    // Quão rápido a mola para de balançar (menor = mais balanço)
                mass: 0.8
              });

              // 3. Converte o número final com mola para a string com 'vw'
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const cardX = useTransform(springXNum, (x) => `${x}vw`);

              return (
                <motion.div 
                  key={story.id} 
                  style={{ x: cardX }}
                  className="will-change-transform"
                >
                  <TiltStoryCard story={story} />
                </motion.div>
              );
            })}
          </div>

          {/* ── CTA Button ── */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex justify-center mt-[clamp(16px,2.5vh,48px)] shrink-0"
          >
            <button className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF4500] to-[#FF6B00] text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,69,0,0.3)] hover:shadow-[0_0_50px_rgba(255,69,0,0.5)] transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3">
                Abrir o App pra Participar
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
