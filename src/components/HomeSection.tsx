"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Terminal, ArrowRight, Activity, Cpu, HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeSection() {
  const t = useTranslations();
  const [typedText, setTypedText] = useState("");
  const fullText = t("Home.terminal_ready");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="home" 
      className="min-h-screen pt-24 pb-12 flex flex-col justify-center relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Greeting & Console */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-semibold glow-cyan"
          >
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span>{t("Common.status")}</span>
          </motion.div>

          <div className="space-y-2">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-slate-400 text-lg md:text-xl font-medium"
            >
              {t("Home.greeting")}
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-200 to-blue-500 tracking-tight"
            >
              {t("Home.name")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-cyan-400 text-md md:text-xl font-semibold tracking-wide uppercase"
            >
              {t("Home.role")}
            </motion.p>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed font-sans"
          >
            &ldquo;{t("Common.slogan")}&rdquo; — Spécialisé dans l&apos;administration des architectures réseaux, la gestion de parcs serveurs et l&apos;implémentation de défenses cyber (IDS/IPS, surveillance SOC).
          </motion.p>

          {/* Terminal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-slate-950/90 border border-cyan-500/20 rounded-xl p-4 glow-cyan font-mono text-xs text-cyan-400/90"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-slate-400">SOC_OPERATOR_CONSOLE v2.4</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <span className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500">&gt; {t("Home.terminal_boot")}</p>
              <p className="text-slate-500">&gt; LOADING MODULES [OK]</p>
              <p className="text-slate-500">&gt; NEON DB STATUS [SECURE]</p>
              <p className="text-cyan-400">
                &gt; {typedText}
                <span className="animate-pulse">|</span>
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() => scrollToSection("cv")}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
            >
              {t("Common.cta_cv")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer text-sm"
            >
              {t("Common.cta_contact")}
            </button>
          </motion.div>
        </div>

        {/* Right Column: SOC Stats Widgets */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 grid grid-cols-1 gap-4"
        >
          {/* Widget 1: CPU load */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-semibold tracking-wider">THREAT MONITOR</span>
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">0.00% THREAT INDEX</div>
            <p className="text-xs text-slate-500 mb-3">All nodes reported secure. Wazuh Active agent online.</p>
            <div className="w-full bg-slate-900 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "3%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="bg-red-500 h-1.5 rounded-full shadow-[0_0_8px_#ff3333]" 
              />
            </div>
          </div>

          {/* Widget 2: System Uptime */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-semibold tracking-wider">SYSTEM PERFORMANCE</span>
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">98.4% STABILITY</div>
            <p className="text-xs text-slate-500 mb-3">Memory: 4.1GB / 16.0GB. CPU Load: 12%</p>
            <div className="w-full bg-slate-900 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "98.4%" }}
                transition={{ duration: 1.5, delay: 0.7 }}
                className="bg-cyan-400 h-1.5 rounded-full shadow-[0_0_8px_#00f0ff]" 
              />
            </div>
          </div>

          {/* Widget 3: Active connection */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-cyan-400/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-semibold tracking-wider">SECURE DATABASE LINK</span>
              <HardDrive className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">ONLINE</div>
            <p className="text-xs text-slate-500">Connected to Neon Cloud database.</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-green-400/80 font-mono bg-green-950/20 px-2 py-1 rounded border border-green-500/20">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              ENDPOINT: pg.neon.tech/neondb (STABLE)
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
