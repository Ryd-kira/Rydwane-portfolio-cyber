"use client";

import React, { useState } from "react";
import { FileDown, Calendar, Mail, Phone, MapPin, UserCheck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CVSection() {
  const t = useTranslations("CV");
  const [downloading, setDownloading] = useState(false);

  const triggerDownload = () => {
    setDownloading(true);
    // Simulate slight lag for cyber telemetry effect
    setTimeout(() => {
      setDownloading(false);
      window.open("/CV.pdf", "_blank");
    }, 1200);
  };

  return (
    <section id="cv" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-4xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <FileDown className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* Canva-style Resume Preview Widget */}
        <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6 md:p-8 glow-cyan relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column (Metadata) */}
            <div className="md:col-span-4 space-y-6 md:border-r md:border-cyan-500/10 md:pr-6">
              {/* Profile Card Header */}
              <div className="text-center md:text-left space-y-3">
                <div className="w-24 h-24 rounded-2xl border-2 border-cyan-400/40 bg-cyan-950/10 mx-auto md:mx-0 flex items-center justify-center relative group">
                  <UserCheck className="w-12 h-12 text-cyan-400" />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Koladé ICHOLA</h3>
                  <p className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">ADMIN SYSTEMS / CYBER</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3 text-xs font-sans text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-500/60" />
                  <span>Cotonou, Bénin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-500/60" />
                  <span className="truncate">hackmanrydwane@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-500/60" />
                  <span>+229 0160203939</span>
                </div>
              </div>

              {/* Skills Index */}
              <div className="space-y-3 pt-4 border-t border-cyan-500/10">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {t("sections.skills")}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {["Linux", "Windows Server", "Wazuh SIEM", "Suricata IDS", "Cisco routing", "pfSense", "Wireshark", "C/Java/PHP", "SQL"].map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-500/25 px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Timeline Details) */}
            <div className="md:col-span-8 space-y-6">
              {/* Profile Bio summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-500/80" />
                  {t("sections.profile")}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Professionnel proactif doté d&apos;une base solide en administration de parcs serveurs et supervision de la sécurité. Capable de configurer des équipements Cisco, concevoir des tunnels IPsec et auditer des réseaux contre les intrusions cyber.
                </p>
              </div>

              {/* Studies */}
              <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {t("sections.education")}
                </h4>
                <div className="space-y-3">
                  <div className="relative pl-4 border-l border-cyan-500/20">
                    <span className="absolute top-1 left-[-4px] w-2 h-2 bg-cyan-400 rounded-full" />
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Licence RMS (Réseaux, Mobilité et Sécurité)</span>
                      <span className="text-slate-500 text-[10px] font-mono">2023 - 2026</span>
                    </div>
                    <p className="text-[10px] text-slate-500">IUT / EPAC, Université d&apos;Abomey-Calavi</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-4 pt-4 border-t border-cyan-500/10">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {t("sections.experience")}
                </h4>
                <div className="space-y-3">
                  <div className="relative pl-4 border-l border-cyan-500/20">
                    <span className="absolute top-1 left-[-4px] w-2 h-2 bg-cyan-400 rounded-full" />
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Stage — UNIR International</span>
                      <span className="text-slate-500 text-[10px] font-mono">Fév - Avr 2026</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Installation et maintenance de systèmes de vidéosurveillance IP et déploiement de systèmes de sécurité incendie.
                    </p>
                  </div>
                  <div className="relative pl-4 border-l border-cyan-500/20">
                    <span className="absolute top-1 left-[-4px] w-2 h-2 bg-cyan-400 rounded-full" />
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Projets SIEM Wazuh & Suricata</span>
                      <span className="text-slate-500 text-[10px] font-mono">2025</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      Conception et virtualisation complète d&apos;une topologie réseau sécurisée sous pfSense avec agents Wazuh configurés pour corréler les logs Suricata.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Action Trigger */}
        <div className="flex justify-center">
          <button
            onClick={triggerDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-8 py-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
          >
            <FileDown className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
            {downloading ? t("downloading") : t("download_btn")}
          </button>
        </div>
      </div>
    </section>
  );
}
