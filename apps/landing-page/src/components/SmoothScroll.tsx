"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — Inicializa o Lenis para scroll suave global.
 * Agora também cuida de 'Pulos Cinematográficos' para seções
 * muito distantes (como o Footer/Waitlist) para evitar o 
 * efeito de speed scroll bagunçado.
 */
export default function SmoothScroll() {
  const [isTeleporting, setIsTeleporting] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      // Intercept internal hash links
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        
        // Para a Lista VIP (muito distante), o scroll liso fica rápido demais e feio.
        // Vamos usar um "Corte Cinemático" (Fade To Black -> Teleport -> Fade In)
        if (anchor.hash === '#waitlist') {
          setIsTeleporting(true);
          
          setTimeout(() => {
            // Pula instantaneamente para a seção com a tela preta
            lenis.scrollTo(anchor.hash, { immediate: true });
            
            // Pequeno delay e volta a acender a tela
            setTimeout(() => {
              setIsTeleporting(false);
            }, 150);
          }, 450); // Tempo do fade out
          
        } else {
          // Para outras seções próximas (ex: Problemas), usa o scroll suave lindão
          lenis.scrollTo(anchor.hash, { 
            offset: 0, 
            duration: 1.8, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#050505] pointer-events-none transition-opacity duration-500 ease-in-out ${
        isTeleporting ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
