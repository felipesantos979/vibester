import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FireReveal from "@/components/FireReveal";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vibester — O Fim da Viagem Perdida",
  description:
    "O primeiro radar social noturno em tempo real. Veja a vibe do rolê antes de sair de casa. Termômetro de energia, vídeos ao vivo e gamificação para a sua noite.",
  keywords:
    "vibester, vida noturna, bares, baladas, rolê, radar noturno, app de bares, energia, vibe, nightlife, heatmap",
  openGraph: {
    title: "Vibester — O Fim da Viagem Perdida",
    description:
      "A pergunta 'será que lá tá bom?' acabou. Veja a vibe do rolê de dentro, antes de sair de casa.",
    type: "website",
    locale: "pt_BR",
  },
};

import GlobalParticles from "@/components/GlobalParticles";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col grain-overlay font-sans text-white relative">
        <GlobalParticles />
        <SmoothScroll />
        <FireReveal>{children}</FireReveal>
      </body>
    </html>
  );
}
