"use client";

import React, { useState, useEffect } from "react";
import { Shield, Play, Terminal, HelpCircle, Activity, Server, Radio, Network } from "lucide-react";
import { useTranslations } from "next-intl";

interface ScanLog {
  text: string;
  type: "info" | "ok" | "warn" | "alert" | "success";
}

export default function CyberLabSection() {
  const t = useTranslations("CyberLab");
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const mockScanSteps: ScanLog[] = [
    { text: "[INFO] Initialisation du scanner Nmap local v7.93...", type: "info" },
    { text: "[INFO] Détection de l'hôte cible : 192.168.10.15 (Target-VM)", type: "info" },
    { text: "[OK] Hôte actif. Début du scan de ports TCP (1000 principaux)...", type: "success" },
    { text: "[INFO] Port 22/tcp [SSH] - OUVERT - OpenSSH 8.9p1 Ubuntu", type: "info" },
    { text: "[WARN] Port 80/tcp [HTTP] - OUVERT - Apache httpd 2.4.52", type: "warn" },
    { text: "[INFO] Port 443/tcp [HTTPS] - FERMÉ", type: "info" },
    { text: "[INFO] Port 3306/tcp [MySQL] - OUVERT - MySQL 8.0.30", type: "info" },
    { text: "[INFO] Analyse des scripts de vulnérabilité (vulners/vuln)...", type: "info" },
    { text: "[ALERT] Alerte Suricata : Tentative brute-force SSH détectée de 192.168.10.50 (Kali-VM)", type: "alert" },
    { text: "[INFO] Wazuh SIEM : Log collecté & indexé sous Event-ID: 8094", type: "info" },
    { text: "[WARN] MySQL configuré avec les accès root par défaut", type: "warn" },
    { text: "[OK] Scan terminé. 3 ports ouverts. Risque global : MODÉRÉ.", type: "success" }
  ];

  const runScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setLogs([]);
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < mockScanSteps.length) {
        setLogs((prev) => [...prev, mockScanSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 900);
  };

  return (
    <section id="cyberlab" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-6xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed pt-2">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Topology Column */}
          <div className="lg:col-span-6 bg-slate-950/70 border border-cyan-500/20 rounded-xl p-5 glow-cyan flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-2">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  {t("topology_title")}
                </span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              </div>

              {/* Interactive SVG Map */}
              <div className="w-full bg-slate-900/40 border border-cyan-500/5 rounded-xl p-4 flex items-center justify-center relative min-h-[300px]">
                <svg viewBox="0 0 500 300" className="w-full h-auto max-w-[450px]">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 240, 255, 0.03)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Connective Paths */}
                  <path d="M 250 40 L 250 100" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                  <path d="M 250 100 L 250 160" stroke="#00f0ff" strokeWidth="2" />
                  <path d="M 250 160 L 120 230" stroke="#00f0ff" strokeWidth="1.5" />
                  <path d="M 250 160 L 250 230" stroke="#00f0ff" strokeWidth="1.5" />
                  <path d="M 250 160 L 380 230" stroke="#00f0ff" strokeWidth="1.5" />

                  {/* Nodes */}
                  {/* WAN Node */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("wan")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx="250" cy="40" r="16" fill="#0b132b" stroke="#0088ff" strokeWidth="2" className="group-hover:stroke-cyan-400 group-hover:fill-cyan-950/20 transition-all duration-300" />
                    <text x="250" y="44" fill="#00f0ff" fontSize="10" textAnchor="middle" fontWeight="bold">WAN</text>
                  </g>

                  {/* Firewall pfSense Node */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("firewall")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <rect x="225" y="90" width="50" height="22" rx="4" fill="#0b132b" stroke="#ff3333" strokeWidth="2" className="group-hover:stroke-red-400 transition-all duration-300" />
                    <text x="250" y="104" fill="#ff3333" fontSize="9" textAnchor="middle" fontWeight="bold">pfSense</text>
                  </g>

                  {/* Switch LAN Node */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("switch")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <rect x="220" y="150" width="60" height="20" rx="2" fill="#0b132b" stroke="#00f0ff" strokeWidth="1.5" />
                    <text x="250" y="163" fill="#00f0ff" fontSize="9" textAnchor="middle" fontWeight="bold">LAN SW</text>
                  </g>

                  {/* Kali VM Attacker */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("kali")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx="120" cy="240" r="14" fill="#0b132b" stroke="#ff8800" strokeWidth="1.5" />
                    <text x="120" y="243" fill="#ff8800" fontSize="8" textAnchor="middle" fontWeight="bold">KALI</text>
                  </g>

                  {/* Wazuh SIEM Node */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("wazuh")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx="250" cy="240" r="14" fill="#0b132b" stroke="#39ff14" strokeWidth="1.5" />
                    <text x="250" y="243" fill="#39ff14" fontSize="8" textAnchor="middle" fontWeight="bold">WAZUH</text>
                  </g>

                  {/* Target VM Node */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode("target")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle cx="380" cy="240" r="14" fill="#0b132b" stroke="#0088ff" strokeWidth="1.5" />
                    <text x="380" y="243" fill="#0088ff" fontSize="8" textAnchor="middle" fontWeight="bold">TARGET</text>
                  </g>
                </svg>

                {/* Info Box based on hovered node */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 border border-cyan-500/20 px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-between text-slate-400">
                  {hoveredNode === "wan" && (
                    <>
                      <span>GATEWAY: 192.168.1.254</span>
                      <span className="text-green-400">CONNECTED</span>
                    </>
                  )}
                  {hoveredNode === "firewall" && (
                    <>
                      <span>pfSense CARRIER: 192.168.10.1</span>
                      <span className="text-red-400">RULES: ACTIVE</span>
                    </>
                  )}
                  {hoveredNode === "switch" && (
                    <>
                      <span>LAN SWITCH (VLAN 10, 20, 30)</span>
                      <span className="text-cyan-400">STP: ENABLED</span>
                    </>
                  )}
                  {hoveredNode === "kali" && (
                    <>
                      <span>PENTEST HOST: 192.168.10.50</span>
                      <span className="text-orange-400">ATTACK SIM</span>
                    </>
                  )}
                  {hoveredNode === "wazuh" && (
                    <>
                      <span>WAZUH SIEM: 192.168.10.100</span>
                      <span className="text-green-400">MONITORING</span>
                    </>
                  )}
                  {hoveredNode === "target" && (
                    <>
                      <span>TARGET METRICS: 192.168.10.15</span>
                      <span className="text-cyan-400">AUDIT READY</span>
                    </>
                  )}
                  {!hoveredNode && (
                    <>
                      <span>SURVOLER UN NOEUD POUR METADATA</span>
                      <span className="text-slate-500">SIEM STATUS [OK]</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Console Column */}
          <div className="lg:col-span-6 bg-slate-950/70 border border-cyan-500/20 rounded-xl p-5 glow-cyan flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  {t("log_console")}
                </span>
                <button
                  disabled={isScanning}
                  onClick={runScan}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-semibold transition-all duration-300 border cursor-pointer ${
                    isScanning
                      ? "bg-slate-900 border-slate-800 text-slate-500"
                      : "bg-cyan-500/10 border-cyan-400/30 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  }`}
                >
                  <Play className="w-3 h-3" />
                  {t("scan_btn")}
                </button>
              </div>

              {/* Console log outputs */}
              <div className="w-full bg-slate-950 rounded-xl p-4 min-h-[300px] max-h-[300px] overflow-y-auto border border-cyan-500/5 font-mono text-[10px] space-y-1.5">
                {logs.length === 0 ? (
                  <div className="text-slate-500 flex flex-col items-center justify-center h-[260px] gap-2">
                    <Activity className="w-8 h-8 text-cyan-500/20 animate-pulse" />
                    <span>Lancer le scan pour simuler l&apos;audit SIEM</span>
                  </div>
                ) : (
                  logs.map((log, lIdx) => {
                    let color = "text-cyan-400/80";
                    if (log.type === "warn") color = "text-yellow-400";
                    if (log.type === "alert") color = "text-red-400 font-bold";
                    if (log.type === "success") color = "text-green-400";

                    return (
                      <div key={lIdx} className={`${color} flex gap-1.5 leading-relaxed`}>
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                        <span>{log.text}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="text-[9px] font-mono text-slate-500 text-right pt-2 border-t border-cyan-500/5">
              TARGET_HOST: 192.168.10.15 | OS_DISCOVERY: LINUX
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
