"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Clock, Award, CheckCircle, ExternalLink, X, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseItem {
  title: string;
  category: string;
  duration: string;
  level: string;
  desc: string;
}

export default function CoursesSection() {
  const t = useTranslations("Courses");
  const [filter, setFilter] = useState<string>("all");
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const coursesList: CourseItem[] = [
    {
      title: t("items.0.title"),
      category: t("items.0.category"),
      duration: t("items.0.duration"),
      level: t("items.0.level"),
      desc: t("items.0.desc")
    },
    {
      title: t("items.1.title"),
      category: t("items.1.category"),
      duration: t("items.1.duration"),
      level: t("items.1.level"),
      desc: t("items.1.desc")
    },
    {
      title: t("items.2.title"),
      category: t("items.2.category"),
      duration: t("items.2.duration"),
      level: t("items.2.level"),
      desc: t("items.2.desc")
    }
  ];

  const filteredCourses = coursesList.filter(
    (c) => filter === "all" || c.category === filter
  );

  const handleAccessClick = (courseTitle: string) => {
    setSelectedCourseTitle(courseTitle);
    setShowRedirectModal(true);
  };

  return (
    <section id="courses" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-5xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-cyan-500/10 pb-6">
          {["all", "cyber", "networks", "linux"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer ${
                filter === cat
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t(`categories.${cat}`).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-cyan-500/15 p-5 rounded-xl glow-cyan hover:border-cyan-400/50 flex flex-col justify-between transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {course.level}
                  </span>
                </div>

                <h3 className="font-bold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {course.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyan-500/10 space-y-3">
                <button
                  onClick={() => handleAccessClick(course.title)}
                  className="w-full flex items-center justify-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 text-xs font-semibold py-2 rounded transition-all duration-300 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {t("access_btn")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redirection / Chariot Informational Modal */}
      <AnimatePresence>
        {showRedirectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-cyan-400/40 p-6 rounded-2xl max-w-sm w-full text-center shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowRedirectModal(false)}
                  className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 mt-2">
                <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400 animate-pulse">
                  <GraduationCap className="w-8 h-8" />
                </div>
                
                <h3 className="font-bold text-slate-200 text-sm">
                  {selectedCourseTitle}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {t("redirect_msg")}
                </p>

                <div className="w-full border border-cyan-500/20 rounded-lg p-3 bg-cyan-950/10 text-[10px] font-mono text-cyan-400 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  SHOP MODULE: CHARIOT v1.0 (FUTURE)
                </div>

                <a
                  href="#contact"
                  onClick={() => setShowRedirectModal(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-all duration-300"
                >
                  {t("goto_chariot")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
