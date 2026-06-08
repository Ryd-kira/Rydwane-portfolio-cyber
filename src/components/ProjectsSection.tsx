"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, Terminal, Cpu, ShieldCheck } from "lucide-react";

// lucide-react doesn't export brand icons — inline SVG for GitHub
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
import { useTranslations, useLocale } from "next-intl";

interface ProjectItem {
  id: string;
  category: "security" | "dev" | "sys";
  titleKey?: string;
  descKey?: string;
  title?: { fr: string; en: string };
  desc?: { fr: string; en: string };
  techs: string[];
  githubUrl: string;
  liveUrl?: string;
}

const projects: ProjectItem[] = [
  {
    id: "wazuh",
    category: "security",
    title: {
      fr: "Déploiement IDS/IPS Wazuh & Suricata",
      en: "Wazuh & Suricata IDS/IPS Deployment"
    },
    desc: {
      fr: "Mise en place d'un environnement de supervision complet avec détection d'intrusions réseau via Suricata et gestion centralisée des alertes avec Wazuh.",
      en: "Implementation of a complete monitoring environment with network intrusion detection via Suricata and centralized alert management with Wazuh."
    },
    techs: ["Wazuh SIEM", "Suricata NIDS", "Debian Linux", "Elasticsearch", "Logstash"],
    githubUrl: "https://github.com/Ryd-kira"
  },
  {
    id: "soc",
    category: "sys",
    title: {
      fr: "SOC Lab Personnel",
      en: "Personal SOC Lab"
    },
    desc: {
      fr: "Laboratoire virtuel simulant une infrastructure d'entreprise avec pare-feu (pfSense), serveurs Windows/Linux, et monitoring actif des événements.",
      en: "Virtual laboratory simulating a corporate infrastructure with firewalls (pfSense), Windows/Linux servers, and active event monitoring."
    },
    techs: ["pfSense Firewall", "Active Directory", "Proxmox VE", "VLANs", "Syslog Server"],
    githubUrl: "https://github.com/Ryd-kira"
  },
  {
    id: "marketplace",
    category: "dev",
    title: {
      fr: "Plateforme Marketplace E-commerce",
      en: "E-commerce Marketplace Platform"
    },
    desc: {
      fr: "Création d'une boutique en ligne moderne et sécurisée, préparant la future intégration commerciale du projet 'Chariot'.",
      en: "Creation of a modern and secure online shop, preparing the future commercial integration of the 'Chariot' project."
    },
    techs: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Stripe API"],
    githubUrl: "https://github.com/Ryd-kira"
  }
];

export default function ProjectsSection({ data }: { data?: ProjectItem[] }) {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [filter, setFilter] = useState<string>("all");

  const activeProjects = data || projects;

  const filteredProjects = activeProjects.filter(
    (p) => filter === "all" || p.category === filter
  );

  return (
    <section id="projects" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-6xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Code className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-cyan-500/10 pb-6">
          {["all", "security", "sys", "dev"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer ${
                filter === category
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t(`tags.${category}`).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-950/70 border border-cyan-500/20 rounded-xl p-5 glow-cyan hover:border-cyan-400/50 flex flex-col justify-between group transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Category icon header */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/10">
                      {project.category.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-200 text-sm md:text-base group-hover:text-cyan-400 transition-colors">
                      {project.title ? project.title[locale as "fr" | "en"] : (project.titleKey ? t(project.titleKey) : "")}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {project.desc ? project.desc[locale as "fr" | "en"] : (project.descKey ? t(project.descKey) : "")}
                    </p>
                  </div>
                </div>

                {/* Tech Badges & Status */}
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techs.map((tech, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[9px] font-mono text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-cyan-500/10 flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-400" />
                      STATUS: VERIFIED
                    </span>
                    <span className="flex items-center gap-0.5 text-green-400">
                      <ShieldCheck className="w-3 h-3" />
                      SECURE
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
