import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CommunitySection from "@/components/CommunitySection";
import B2BSection from "@/components/B2BSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <CommunitySection />
      <B2BSection />
      <Footer />
    </main>
  );
}
