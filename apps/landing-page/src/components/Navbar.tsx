"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import logoSvg from "@/components/midia/VIBESTER.svg";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "glass" : "bg-transparent"}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <Image 
            src={logoSvg} 
            alt="Vibester" 
            className="w-32 sm:w-40 lg:w-48 h-auto transition-transform duration-300 group-hover:scale-105" 
            priority 
          />
        </a>

        {/* CTA */}
        <a
          href="#waitlist"
          className="btn-fire relative z-10 text-sm px-6 py-3 rounded-xl"
        >
          <span className="relative z-10">Entrar na Lista VIP</span>
        </a>
      </nav>
    </header>
  );
}
