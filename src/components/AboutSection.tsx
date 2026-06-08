"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Eye, Target, Compass } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("About");

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-5xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <User className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bio & Details Card */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-slate-950/70 border border-cyan-500/20 p-6 rounded-2xl glow-cyan flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-cyan-500/10 pb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">IDENTIFICATION</h3>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-sm">
                {t("bio")}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-cyan-500/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">OPERATOR NAME:</span>
                <span className="text-cyan-400 font-bold">Koladé (ICHOLA Rydwane)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">LOCATION:</span>
                <span className="text-slate-300">Cotonou, Benin</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">SECTOR:</span>
                <span className="text-slate-300">Systems, Networks, Pentesting</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">STATUS:</span>
                <span className="text-green-400 animate-pulse font-bold">READY TO DEPLOY</span>
              </div>
            </div>
          </motion.div>

          {/* Vision & Stats Card */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-slate-950/70 border border-cyan-500/20 p-6 rounded-2xl glow-blue flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-cyan-500/10 pb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-cyan-400">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{t("vision_title")}</h3>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-sm">
                {t("vision_text")}
              </p>
            </div>

            <div className="mt-8 space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">LEVEL (LP RSN)</span>
                  <span className="text-cyan-400">90%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full w-[90%] shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">CYBER DEFENSE</span>
                  <span className="text-cyan-400">80%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full w-[80%] shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">PENTEST / ATTACK</span>
                  <span className="text-cyan-400">65%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full w-[65%] shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">DEV / AUTOMATION</span>
                  <span className="text-cyan-400">75%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full w-[75%] shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
