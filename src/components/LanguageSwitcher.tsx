"use client";

import React from "react";
import { usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const toggleLocale = () => {
    const nextLocale = currentLocale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLocale}
      className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 px-3 py-1.5 rounded-full hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-300 text-xs font-semibold cursor-pointer"
    >
      <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
      <span className={currentLocale === "fr" ? "text-cyan-400" : "text-slate-500"}>FR</span>
      <span className="text-slate-700">|</span>
      <span className={currentLocale === "en" ? "text-cyan-400" : "text-slate-500"}>EN</span>
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
    </motion.button>
  );
}
