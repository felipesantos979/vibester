"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Car, Ghost, Hourglass, Eye } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      title: "Viagem Perdida",
      description: "Gastar grana de Uber pra um lugar que tá completamente vazio.",
      icon: <Car className="w-12 h-12 text-[#FF4500]" strokeWidth={1.5} />,
    },
    {
      title: "Clima Desanimado",
      description: "Chegar hypado e encontrar a vibe do rolê totalmente fraca.",
      icon: <Ghost className="w-12 h-12 text-[#FF4500]" strokeWidth={1.5} />,
    },
    {
      title: "Fila da Frustração",
      description: "Ficar 1h na fila gigante pra um lugar que nem tá valendo.",
      icon: <Hourglass className="w-12 h-12 text-[#FF4500]" strokeWidth={1.5} />,
    },
    {
      title: "Qual é a Boa?",
      description: "Perder tempo no Insta tentando descobrir onde a galera tá.",
      icon: <Eye className="w-12 h-12 text-[#FF4500]" strokeWidth={1.5} />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="problems" className="relative w-full py-32 md:py-48 bg-[#000000] overflow-hidden flex flex-col justify-center items-center">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,69,0,0.08)_0%,rgba(0,0,0,1)_70%)]" />



      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 space-y-20 w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white">
            A famosa <br className="md:hidden" />
            <span 
              className="text-gradient-fire drop-shadow-[0_0_20px_rgba(255,69,0,0.5)]"
            >
              viagem perdida
            </span>
          </h2>
          <p className="text-zinc-300 text-xl md:text-2xl max-w-2xl mx-auto font-medium tracking-tight">
            Sair de casa virou roleta russa. Chega disso.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {problems.map((problem, index) => (
            <TiltCard key={index} problem={problem} itemVariants={itemVariants} />
          ))}
        </motion.div>

      </div>
      
      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </section>
  );
}

function TiltCard({ problem, itemVariants }: { problem: any; itemVariants: Variants }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mola suave para o tilt
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

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
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 overflow-visible transition-colors duration-500"
    >
      {/* Background/Glow layer that doesn't pop out in 3D */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF4500]/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#FF4500]/0 group-hover:ring-[#FF4500]/40 transition-all duration-500 shadow-[0_0_0_rgba(255,69,0,0)] group-hover:shadow-[0_0_40px_rgba(255,69,0,0.15)] pointer-events-none" />

      {/* Content wrapper pushed OUT in Z-space */}
      <div 
        style={{ transform: "translateZ(40px)" }} 
        className="flex flex-col h-full relative z-10 pointer-events-none transition-transform duration-300"
      >
        <motion.div 
          className="mb-8 w-fit pointer-events-auto"
          whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0], transition: { duration: 0.4 } }}
        >
          <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-inner group-hover:border-[#FF4500]/40 transition-colors duration-500 group-hover:bg-[#FF4500]/10">
            {problem.icon}
          </div>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          {problem.title}
        </h3>
        
        <p className="text-zinc-400 leading-relaxed font-medium text-base md:text-lg transition-colors group-hover:text-zinc-300 drop-shadow-md">
          {problem.description}
        </p>
      </div>
    </motion.div>
  );
}
