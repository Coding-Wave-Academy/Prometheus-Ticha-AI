"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  shape: "square" | "circle" | "strip";
}

const CONFETTI_COLORS = [
  "#C8FF2A",
  "#FF882E",
  "#9333EA",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
  "#10B981",
  "#84CC16",
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 720 - 360,
    shape: (["square", "circle", "strip"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

/**
 * Lightweight CSS + Framer Motion confetti burst.
 * Fires once on mount for ~3 seconds then auto-hides.
 */
export default function ConfettiBurst() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setPieces(generatePieces(50));
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || pieces.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: "-10vh",
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            y: "110vh",
            rotate: piece.rotation,
            opacity: [1, 1, 0.8, 0],
            scale: [1, 1.1, 0.8],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width:
              piece.shape === "strip" ? piece.size * 0.4 : piece.size,
            height:
              piece.shape === "strip" ? piece.size * 2 : piece.size,
            backgroundColor: piece.color,
            borderRadius:
              piece.shape === "circle"
                ? "50%"
                : piece.shape === "strip"
                  ? "2px"
                  : "2px",
          }}
        />
      ))}
    </div>
  );
}
