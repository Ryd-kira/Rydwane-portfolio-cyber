"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Server, 
  Network, 
  ShieldAlert, 
  ShieldCheck, 
  Code, 
  Database, 
  LifeBuoy, 
  Users, 
  Layers 
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ServiceItem {
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const servicesList: ServiceItem[] = [
  { titleKey: "items.0", icon: Server },
  { titleKey: "items.1", icon: Network },
  { titleKey: "items.2", icon: ShieldCheck },
  { titleKey: "items.3", icon: ShieldAlert },
  { titleKey: "items.4", icon: Code },
  { titleKey: "items.5", icon: Database },
  { titleKey: "items.6", icon: LifeBuoy },
  { titleKey: "items.7", icon: Users }
];

export default function ServicesSection() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-6xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Layers className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-950/70 border border-cyan-500/10 hover:border-cyan-400/50 p-5 rounded-xl glow-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400 w-fit group-hover:bg-cyan-500/20 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm tracking-wider uppercase group-hover:text-cyan-400 transition-colors">
                    {t(`${service.titleKey}.title`)}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {t(`${service.titleKey}.desc`)}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-cyan-500/10 flex justify-between items-center text-[8px] font-mono text-slate-500">
                  <span>CATALOG_NODE: 0{idx + 1}</span>
                  <span className="text-green-500">SYS_AVAILABLE</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
