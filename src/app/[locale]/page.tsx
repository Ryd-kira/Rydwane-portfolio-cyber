"use client";

import React, { useState, useEffect } from "react";
import NavigationDock from "@/components/NavigationDock";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CyberBackground from "@/components/CyberBackground";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import ProjectsSection from "@/components/ProjectsSection";
import CyberLabSection from "@/components/CyberLabSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import CoursesSection from "@/components/CoursesSection";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import { Shield } from "lucide-react";
import initialDbData from "@/data/db.json";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [portfolioData, setPortfolioData] = useState<any>(initialDbData);

  useEffect(() => {
    // Fetch fresh database updates on client load
    fetch("/api/portfolio/content")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch content API");
      })
      .then((data) => {
        if (data && data.skills) {
          setPortfolioData(data);
        }
      })
      .catch((err) => console.warn("Using local static data fallback:", err));
  }, []);

  useEffect(() => {
    const sections = [
      "home", "about", "skills", "education", "projects", 
      "cyberlab", "services", "blog", "courses", "cv", "contact"
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger active state when section is centered
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Dynamic matrix cyber background canvas */}
      <CyberBackground />

      {/* Futuristic Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-slate-950/70 backdrop-blur-md border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-mono font-black text-xs md:text-sm text-slate-100 tracking-wider">
            KOLADÉ <span className="text-cyan-400">SOC_CONSOLE</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Floating icon dock menu */}
      <NavigationDock activeSection={activeSection} />

      {/* Main sections wrapper */}
      <div className="pb-24">
        <HomeSection />
        <AboutSection />
        <SkillsSection data={portfolioData?.skills} />
        <EducationSection data={portfolioData?.education} />
        <ProjectsSection data={portfolioData?.projects} />
        <CyberLabSection />
        <ServicesSection />
        <BlogSection data={portfolioData?.blogPosts} />
        <CoursesSection />
        <CVSection />
        <ContactSection />
      </div>
    </main>
  );
}
