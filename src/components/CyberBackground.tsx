"use client";

import React, { useEffect, useRef } from "react";

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Cyber characters and words
    const cyberWords = [
      "01", "10", "SOC", "CYBER", "NET", "PORT", "IP", "[OK]", 
      "[WARN]", "[DENY]", "SURICATA", "WAZUH", "KALI", "ROOT",
      "SYS", "SSH", "HTTPS", "SECURE", "SHELL", "DB", "PENTEST"
    ];

    const fontSize = 11;
    const columns = Math.ceil(canvas.width / 45); // Space columns wider for readable words
    const drops: number[] = [];
    const dropWords: string[] = [];

    // Initialize drops and current word
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // staggered start
      dropWords[i] = cyberWords[Math.floor(Math.random() * cyberWords.length)];
    }

    let frameId: number;

    const draw = () => {
      // Fade out background to create trailing effect
      ctx.fillStyle = "rgba(6, 9, 19, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text font
      ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = dropWords[i];
        const x = i * 45;
        const y = drops[i] * fontSize;

        // Choose color based on word status
        if (text.includes("DENY") || text.includes("WARN")) {
          ctx.fillStyle = "rgba(255, 51, 51, 0.35)"; // neon red
        } else if (text.includes("OK") || text.includes("SECURE")) {
          ctx.fillStyle = "rgba(57, 255, 20, 0.35)"; // neon green
        } else {
          ctx.fillStyle = "rgba(0, 240, 255, 0.18)"; // cyan
        }

        ctx.fillText(text, x, y);

        // Reset drops when they reach the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          dropWords[i] = cyberWords[Math.floor(Math.random() * cyberWords.length)];
        }

        // Increment drop position
        drops[i] += 0.8;
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#060913]"
    />
  );
}
