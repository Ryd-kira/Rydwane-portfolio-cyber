"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, User, Eye, X, BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface BlogPost {
  id: string;
  category: "cyber" | "network" | "linux" | "tutorials";
  date: string;
  author: string;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
  content: { fr: string; en: string };
}

const blogPosts: BlogPost[] = [
  {
    id: "wazuh-suricata",
    category: "cyber",
    date: "2026-05-15",
    author: "Koladé",
    title: {
      fr: "Déploiement de Wazuh avec Suricata sur Debian",
      en: "Deploying Wazuh with Suricata on Debian Server"
    },
    desc: {
      fr: "Guide complet pour installer et lier le moteur NIDS Suricata avec le SIEM Wazuh pour un monitoring SOC en temps réel.",
      en: "Step-by-step guide to install and hook the Suricata NIDS engine to the Wazuh SIEM client for real-time security operations."
    },
    content: {
      fr: "## Introduction\nDans ce tutoriel, nous allons voir comment coupler Wazuh et Suricata sous Debian 12 pour analyser et remonter les alertes réseaux sur notre console SIEM.\n\n### 1. Installation de Suricata\nExécutez la commande suivante :\n```bash\nsudo apt install suricata -y\n```\n\n### 2. Configuration des interfaces\nÉditez `/etc/suricata/suricata.yaml` et spécifiez votre interface réseau principale (ex: `eth0`).\n\n### 3. Liaison avec Wazuh Agent\nAjoutez ce bloc dans la configuration de l'agent `/var/ossec/etc/ossec.conf` :\n```xml\n<localfile>\n  <log_format>json</log_format>\n  <location>/var/log/suricata/eve.json</location>\n</localfile>\n```\n\n### Conclusion\nRedémarrez les services. Vos alertes de paquets réseau suspects apparaîtront désormais directement dans le dashboard de votre console Wazuh.",
      en: "## Introduction\nIn this tutorial, we will configure Suricata on Debian 12 and redirect its network events into the Wazuh SIEM console.\n\n### 1. Install Suricata\nRun the install command:\n```bash\nsudo apt install suricata -y\n```\n\n### 2. Interface configuration\nEdit the `/etc/suricata/suricata.yaml` file to set your network interfaces.\n\n### 3. Hooking with Wazuh Agent\nConfigure `/var/ossec/etc/ossec.conf` to monitor the Suricata json logs:\n```xml\n<localfile>\n  <log_format>json</log_format>\n  <location>/var/log/suricata/eve.json</location>\n</localfile>\n```\n\n### Conclusion\nRestart the services. Network alerts will now pop up in your Wazuh dashboard."
    }
  },
  {
    id: "linux-hardening",
    category: "linux",
    date: "2026-04-10",
    author: "Koladé",
    title: {
      fr: "Sécurisation Linux : Guide Pratique de Hardening",
      en: "Linux Hardening: Practical Security Checklist"
    },
    desc: {
      fr: "Découvrez les étapes indispensables pour sécuriser vos serveurs Linux en production (SSH, PAM, UFW, Sysctl).",
      en: "Discover key practices to harden your Linux servers against common attacks (SSH key setup, PAM modules, UFW, sysctl configs)."
    },
    content: {
      fr: "## Sécurisation SSH\nLe premier point d'entrée d'un serveur Linux est le service SSH. Pour le durcir :\n- Changez le port par défaut (ex: 2222)\n- Désactivez le login root (`PermitRootLogin no`)\n- Désactivez l'authentification par mot de passe et imposez l'usage de clés SSH.\n\n## UFW Firewall\nActivez les règles indispensables :\n```bash\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 2222/tcp\nsudo ufw enable\n```",
      en: "## Harden SSH\nSecure SSH by editing `/etc/ssh/sshd_config`:\n- Change default port to something else (e.g., 2222)\n- Disable root logins (`PermitRootLogin no`)\n- Use key-based authentication only.\n\n## UFW Configuration\nRun these commands:\n```bash\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 2222/tcp\nsudo ufw enable\n```"
    }
  }
];

export default function BlogSection({ data }: { data?: BlogPost[] }) {
  const t = useTranslations("Blog");
  const locale = useLocale() as "fr" | "en";
  const [filter, setFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const activePosts = data || blogPosts;

  const filteredPosts = activePosts.filter(
    (post) => filter === "all" || post.category === filter
  );

  return (
    <section id="blog" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-5xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <FileText className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-cyan-500/10 pb-6">
          {["all", "cyber", "network", "linux", "tutorials"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer ${
                filter === cat
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t(`categories.${cat}`).toUpperCase()}
            </button>
          ))}
        </div>

        {/* Blog Posts Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 font-mono py-12">
              {t("no_articles")}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-slate-950/70 border border-cyan-500/15 p-5 rounded-xl glow-cyan hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span>AUTHOR: {post.author.toUpperCase()}</span>
                  </div>

                  <h3 className="font-bold text-slate-200 text-sm md:text-base group-hover:text-cyan-400 transition-colors">
                    {post.title[locale]}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
                    {post.desc[locale]}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-cyan-500/10 flex justify-between items-center text-[10px] font-mono text-cyan-400">
                  <span className="flex items-center gap-1 hover:text-cyan-300">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t("read_more")}
                  </span>
                  <span className="text-slate-600">SECURE_POST</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-cyan-400/40 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.2)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 md:p-6 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/10">
                    {selectedPost.category.toUpperCase()}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-slate-100">
                    {selectedPost.title[locale]}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs md:text-sm text-slate-300 leading-relaxed scrollbar-thin">
                <div className="flex gap-4 text-[10px] font-mono text-slate-500 border-b border-cyan-500/5 pb-2 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedPost.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{selectedPost.author}</span>
                </div>
                <div className="whitespace-pre-line space-y-3 prose prose-invert max-w-none">
                  {selectedPost.content[locale]}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
