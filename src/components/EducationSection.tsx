"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface EducationItem {
  year: string;
  school: string;
  degree: string;
  desc: string;
}

export default function EducationSection({ data }: { data?: any[] }) {
  const t = useTranslations("Education");
  const locale = useLocale();

  const timelineItems: EducationItem[] = data 
    ? data.map((item: any) => ({
        year: item.year[locale as "fr" | "en"],
        school: item.school[locale as "fr" | "en"],
        degree: item.degree[locale as "fr" | "en"],
        desc: item.desc[locale as "fr" | "en"]
      }))
    : [
        {
          year: t("timeline.0.year"),
          school: t("timeline.0.school"),
          degree: t("timeline.0.degree"),
          desc: t("timeline.0.desc")
        },
        {
          year: t("timeline.1.year"),
          school: t("timeline.1.school"),
          degree: t("timeline.1.degree"),
          desc: t("timeline.1.desc")
        },
        {
          year: t("timeline.2.year"),
          school: t("timeline.2.school"),
          degree: t("timeline.2.degree"),
          desc: t("timeline.2.desc")
        }
      ];

  return (
    <section id="education" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-4xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        <div className="relative border-l border-cyan-500/20 ml-4 md:ml-8 space-y-10 pl-6 md:pl-10">
          {timelineItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="timeline-pulse relative bg-slate-950/60 border border-cyan-500/10 rounded-xl p-5 md:p-6 glow-cyan hover:border-cyan-500/30 transition-all duration-300"
            >
              {/* Event meta info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/10 pb-3 mb-3">
                <span className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
                  <BookOpen className="w-3 h-3" />
                  EVENT_LOG_ID: LP-RSN-0{idx + 1}
                </span>
              </div>

              {/* Title & Organization */}
              <div className="space-y-1">
                <h3 className="text-base md:text-lg font-bold text-slate-200">
                  {item.degree}
                </h3>
                <h4 className="text-xs font-semibold text-cyan-500/80 tracking-wider uppercase">
                  {item.school}
                </h4>
              </div>

              {/* Description */}
              <p className="mt-3 text-slate-400 text-sm font-sans leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
