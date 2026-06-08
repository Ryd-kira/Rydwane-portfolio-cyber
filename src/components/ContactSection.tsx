"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred");
    }
  };

  const handleWhatsAppRedirect = () => {
    const whatsappUrl = `https://wa.me/2290160203939?text=${encodeURIComponent(
      "Bonjour Koladé, je viens de visiter votre site web portfolio et je souhaiterais vous contacter."
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contact" className="min-h-screen py-24 flex flex-col justify-center relative">
      <div className="max-w-4xl mx-auto w-full px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
            <Mail className="w-4 h-4" />
            {t("title")}
          </h2>
          <div className="h-0.5 w-16 bg-cyan-400 mx-auto rounded shadow-[0_0_8px_#00f0ff]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Quick Connect details */}
          <div className="bg-slate-950/70 border border-cyan-500/20 p-6 rounded-2xl glow-cyan space-y-6">
            <div className="border-b border-cyan-500/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
                CANAUX DE RETOUR RAPIDE
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-1">
                Liaison directe avec l&apos;opérateur de garde.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="p-3 bg-cyan-950/15 border border-cyan-500/15 rounded-lg flex items-center justify-between">
                <span>EMAIL OPERATOR:</span>
                <a href="mailto:hackmanrydwane@gmail.com" className="text-cyan-400 hover:underline">
                  hackmanrydwane@gmail.com
                </a>
              </div>

              <div className="p-3 bg-cyan-950/15 border border-cyan-500/15 rounded-lg flex items-center justify-between">
                <span>LOCALISATION:</span>
                <span className="text-slate-400">Bénin, Cotonou</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppRedirect}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg text-xs transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            >
              <Phone className="w-4 h-4" />
              {t("whatsapp_btn")}
            </button>
          </div>

          {/* Secure DB Transmission Form */}
          <form 
            onSubmit={handleSubmit}
            className="bg-slate-950/70 border border-cyan-500/20 p-6 rounded-2xl glow-blue space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-cyan-500/80 uppercase block">
                {t("form_name")}
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,240,255,0.2)] rounded px-3 py-2 text-xs text-slate-200 outline-none font-mono transition-all duration-300"
                placeholder="Ex: John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-cyan-500/80 uppercase block">
                {t("form_email")}
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,240,255,0.2)] rounded px-3 py-2 text-xs text-slate-200 outline-none font-mono transition-all duration-300"
                placeholder="Ex: mail@domain.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-cyan-500/80 uppercase block">
                {t("form_message")}
              </label>
              <textarea
                required
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-cyan-500/20 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(0,240,255,0.2)] rounded px-3 py-2 text-xs text-slate-200 outline-none font-sans transition-all duration-300 resize-none"
                placeholder="Ex: Transmission sécurisée..."
              />
            </div>

            {/* Status alerts */}
            {status === "success" && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 bg-green-950/20 p-2.5 rounded border border-green-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t("success")}</span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 bg-red-950/20 p-2.5 rounded border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage || t("error")}</span>
              </div>
            )}

            <button
              disabled={status === "sending"}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {status === "sending" ? t("sending") : t("form_submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
