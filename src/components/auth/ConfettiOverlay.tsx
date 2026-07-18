"use client";

import React, { useEffect, useRef } from "react";

/**
 * ConfettiOverlay — Lightweight Canvas-based neobrutalist confetti overlay.
 * Renders falling square particles in signature brand colors:
 * lime (#B6FF00), gold (#FFB040), soft blue (#D3E2FF), pink (#FFD9E0), dark brown (#965A18).
 */
export default function ConfettiOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Fit canvas to window or card wrapper dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle setup
    const colors = ["#B6FF00", "#FFB040", "#D3E2FF", "#FFD9E0", "#965A18", "#000000"];
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -50,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2.5 + 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 3 - 1.5,
      opacity: 1,
    }));

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.opacity > 0.01) {
          alive = true;
          p.x += p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.005; // Fade out slowly over ~3-4 seconds

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1.5;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
}
