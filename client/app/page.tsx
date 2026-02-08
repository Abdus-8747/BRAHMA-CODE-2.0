'use client'
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function HomePage() {
  const { setTheme } = useTheme()

  // useEffect removal: Defaulting to system preference or manual toggle

  return (
    <main className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
