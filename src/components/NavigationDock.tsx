"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  User, 
  Brain, 
  GraduationCap, 
  Laptop, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  BookOpen, 
  FileDown, 
  Mail 
} from "lucide-react";
import { useTranslations } from "next-intl";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  translationKey: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, translationKey: "home" },
  { id: "about", icon: User, translationKey: "about" },
  { id: "skills", icon: Brain, translationKey: "skills" },
  { id: "education", icon: GraduationCap, translationKey: "education" },
  { id: "projects", icon: Laptop, translationKey: "projects" },
  { id: "cyberlab", icon: ShieldAlert, translationKey: "cyberlab" },
  { id: "services", icon: Cpu, translationKey: "services" },
  { id: "blog", icon: FileText, translationKey: "blog" },
  { id: "courses", icon: BookOpen, translationKey: "courses" },
  { id: "cv", icon: FileDown, translationKey: "cv" },
  { id: "contact", icon: Mail, translationKey: "contact" }
];

export default function NavigationDock({ activeSection }: { activeSection: string }) {
  const t = useTranslations("Common.nav");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:bottom-auto md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2 md:w-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex md:flex-col items-center justify-around md:justify-center gap-3 bg-slate-950/80 backdrop-blur-lg border border-cyan-500/20 px-4 py-3 md:py-5 md:px-3 rounded-full md:rounded-2xl glow-cyan"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <div
              key={item.id}
              className="relative group cursor-pointer"
              onClick={() => handleScroll(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.button
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,240,255,0.4)]" 
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 border border-transparent"
                }`}
                aria-label={t(item.translationKey)}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-1 md:top-1/2 md:-translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: 10 }}
                    className="absolute hidden md:block right-14 top-1/2 -translate-y-1/2 bg-slate-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                      {t(item.translationKey).toUpperCase()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
