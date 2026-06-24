"use client";

import type { ViewName } from "@/lib/data";
import { HeroSection } from "@/components/hero-section";
import { BibleScrolls } from "@/components/bible-scrolls";
import { GlobeSection } from "@/components/globe-section";
import { StoriesSection } from "@/components/stories-section";
import { WaysToHelp } from "@/components/ways-to-help";
import { CTASection } from "@/components/cta-section";

export function HomeView({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <BibleScrolls />
      <GlobeSection />
      <StoriesSection />
      <WaysToHelp onNavigate={onNavigate} />
      <CTASection onNavigate={onNavigate} variant="dark" />
    </div>
  );
}
