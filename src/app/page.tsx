import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhySection } from "@/components/landing/WhySection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ExplorePreview } from "@/components/landing/ExplorePreview";
import { MarqueeSection } from "@/components/landing/MarqueeSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { CtaFooterSection } from "@/components/landing/CtaFooterSection";

export const metadata: Metadata = {
  title: "CollaboLab — Find Your People. Build Together.",
  description:
    "Platform kolaborasi real-time untuk Gen-Z. Temukan partner project, join lomba, dan bangun portofolio bersama dengan sistem Trust Score.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhySection />
        <HowItWorksSection />
        <ExplorePreview />
        <MarqueeSection />
        <TrustSection />
        <CtaFooterSection />
      </main>
    </>
  );
}
