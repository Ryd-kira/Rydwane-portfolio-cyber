import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  
  return {
    title: isFr ? "Koladé | Console SOC & Portfolio Cybersécurité" : "Koladé | SOC Console & Cybersecurity Portfolio",
    description: isFr 
      ? "Portfolio professionnel de ICHOLA Rydwanoullah Koladé Alabi - Spécialiste Réseaux, Systèmes et Cybersécurité. Projets SOC, Wazuh, Suricata et développement."
      : "Professional Portfolio of ICHOLA Rydwanoullah Koladé Alabi - Networks, Systems and Cybersecurity Specialist. SOC, Wazuh, Suricata and Web Dev projects.",
    keywords: ["Cybersécurité", "Réseaux", "Systèmes", "SOC", "Wazuh", "Suricata", "Pentest", "Bénin", "Koladé", "Cybersecurity", "Benin"],
    authors: [{ name: "ICHOLA Rydwanoullah Koladé Alabi", url: "https://github.com/Ryd-kira" }],
    openGraph: {
      title: isFr ? "Koladé | Console SOC & Portfolio Cybersécurité" : "Koladé | SOC Console & Cybersecurity Portfolio",
      description: isFr 
        ? "Explorez mon lab cyber, mes projets SOC & réseaux."
        : "Explore my cyber lab, SOC & networking projects.",
      url: `https://kolade-cyber.vercel.app/${locale}`,
      siteName: "Koladé Portfolio",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Koladé SOC Console Preview",
        },
      ],
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "Koladé | Console SOC & Portfolio" : "Koladé | SOC Console & Portfolio",
      description: isFr ? "Projets de Cybersécurité et Réseaux" : "Cybersecurity & Networking Projects",
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="antialiased min-h-screen text-[#c0d1eb] bg-[#060913] selection:bg-cyan-500/30 selection:text-cyan-300">
        <div className="scanlines" />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
