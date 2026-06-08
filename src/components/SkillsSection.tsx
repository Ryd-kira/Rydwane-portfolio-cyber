"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Network, ShieldCheck, Terminal, Code2, Database, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";

interface SkillItem {
  name: string;
  level: number; // 0 to 100
}

interface SkillCategory {
  titleKey?: string;
  category?: string;
  icon?: React.ComponentType<{ className?: string }>;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    titleKey: "networks",
    icon: Network,
    skills: [
      { name: "Cisco IOS Routing & Switching", level: 85 },
      { name: "VPNs (IPsec, OpenVPN)", level: 80 },
      { name: "VLANs & Subnetting", level: 90 },
      { name: "TCP/IP & Network Protocols", level: 90 }
    ]
  },
  {
    titleKey: "security",
    icon: ShieldCheck,
    skills: [
      { name: "Wazuh SIEM / IDS", level: 80 },
      { name: "Suricata NIDS/NIPS", level: 78 },
      { name: "pfSense & Firewall hardening", level: 82 },
      { name: "Wireshark Packet Analysis", level: 85 }
    ]
  },
  {
    titleKey: "os",
    icon: Terminal,
    skills: [
      { name: "Linux (Debian, Rocky Linux)", level: 88 },
      { name: "Bash Scripting", level: 80 },
      { name: "Windows Server (Active Directory)", level: 75 },
      { name: "GPOs & Policies management", level: 72 }
    ]
  },
  {
    titleKey: "dev",
    icon: Code2,
    skills: [
      { name: "C Language", level: 65 },
      { name: "Java Programming", level: 70 },
      { name: "PHP / Web Backends", level: 75 },
      { name: "JavaScript & TypeScript", level: 78 }
    ]
  },
  {
    titleKey: "db",
    icon: Database,
    skills: [
      { name: "PostgreSQL & SQLite", level: 80 },
      { name: "MySQL / MariaDB", level: 78 },
      { name: "SQL Query Optimization", level: 75 }
    ]
  },
  {
    titleKey: "tools",
    icon: Wrench,
    skills: [
      { name: "Kali Linux / Pentesting OS", level: 85 },
      { name: "Nmap Network Scanning", level: 90 },
      { name: "Metasploit & Exploit testing", level: 65 },
      { name: "Nessus Vulnerability Auditing", level: 70 }
    ]
  }
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  networks: Network,
  security: ShieldCheck,
  os: Terminal,
  dev: Code2,
  db: Database,
  tools: Wrench
};

export default function SkillsSection({ data }: { data?: SkillCategory[] }) {
  const t = useTranslations("Skills");

  const activeCategories = (data || skillCategories).map(cat => {
    const key = cat.category || cat.titleKey || "tools";
    const icon = categoryIcons[key] || Wrench;
    return {
      titleKey: key,
      icon: icon,
      skills: cat.skills
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="skills" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-6xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Brain className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-slate-950/70 border border-cyan-500/20 p-5 rounded-xl glow-cyan flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 border-b border-cyan-500/10 pb-3 mb-4">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-slate-200 text-sm tracking-wider uppercase">
                      {t(`categories.${category.titleKey}`)}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">{skill.name}</span>
                          <span className="text-cyan-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className="bg-cyan-400 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-500/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>MODULE_SECURE</span>
                  <span className="text-green-500">SYS_OK</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
