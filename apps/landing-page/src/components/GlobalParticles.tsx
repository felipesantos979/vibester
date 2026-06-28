"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlobalParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Render 120 particles spread across the entire document height
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      {Array.from({ length: 120 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 1.5,
            height: 2 + (i % 3) * 1.5,
            // Use pseudo-random distribution across the screen
            left: `${5 + (i * 17.3) % 90}%`,
            top: `${5 + (i * 23.7) % 90}%`,
            backgroundColor: i % 3 === 0 ? "#FF4500" : i % 3 === 1 ? "#FF6B00" : "#FFA500",
            filter: `blur(${1 + (i % 2)}px)`,
            opacity: 0.1 + (i % 4) * 0.05,
          }}
          animate={{
            y: [0, -20 - (i % 3) * 15, 0],
            opacity: [
              0.1 + (i % 4) * 0.05,
              0.25 + (i % 3) * 0.1,
              0.1 + (i % 4) * 0.05
            ],
          }}
          transition={{
            duration: 5 + (i % 4) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 7) * 0.5,
          }}
        />
      ))}
    </div>
  );
}
