import confetti from "canvas-confetti";

export const TICHA_BRAND_CONFETTI_COLORS = [
  "#C8FF2A", // Ticha Lime
  "#FF882E", // Ticha Orange
  "#9333EA", // Vibrant Purple
  "#3B82F6", // Electric Blue
  "#FFD600", // Bright Gold
  "#00C48C", // Emerald Green
  "#FF4365", // Coral Red
  "#FFFFFF", // Crisp White
];

export const TICHA_STREAK_CONFETTI_COLORS = [
  "#FF882E", // Fire Orange
  "#FFB040", // Amber Gold
  "#FFD600", // Bright Gold
  "#C8FF2A", // Lime Spark
  "#FF3300", // Flame Red
  "#FFFFFF",
];

const DEFAULT_Z_INDEX = 99999;

/**
 * Safely executes canvas-confetti in a browser environment.
 */
function safeConfetti(options: confetti.Options) {
  if (typeof window === "undefined") return;
  try {
    confetti({
      zIndex: DEFAULT_Z_INDEX,
      disableForReducedMotion: false,
      ...options,
    });
  } catch {
    // Safely ignore in non-browser or worker contexts
  }
}

/**
 * Triggers a realistic physics-based multi-stage confetti burst using canvas-confetti.
 */
export function fireConfettiBurst(customOptions?: Partial<confetti.Options>) {
  if (typeof window === "undefined") return;

  const count = customOptions?.particleCount ?? 180;
  const baseDefaults: confetti.Options = {
    origin: { y: 0.65 },
    colors: customOptions?.colors ?? TICHA_BRAND_CONFETTI_COLORS,
    zIndex: DEFAULT_Z_INDEX,
    shapes: ["square", "circle", "star"],
    ...customOptions,
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    safeConfetti({
      ...baseDefaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  };

  // Stage 1: Focused high-velocity upward burst
  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    scalar: 0.9,
  });

  // Stage 2: Wider medium-velocity fan
  fire(0.2, {
    spread: 65,
    startVelocity: 45,
    scalar: 1.1,
  });

  // Stage 3: Expansive canopy
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.85,
  });

  // Stage 4: Large floating stars and discs
  fire(0.1, {
    spread: 130,
    startVelocity: 25,
    decay: 0.93,
    scalar: 1.3,
  });

  // Stage 5: Wide perimeter shower
  fire(0.1, {
    spread: 140,
    startVelocity: 48,
    scalar: 1.0,
  });
}

/**
 * Fires dynamic side cannons shooting from both corners for major achievements.
 */
export function fireSideCannons(durationMs = 2500, customColors?: string[]) {
  if (typeof window === "undefined") return;

  const end = Date.now() + durationMs;
  const colors = customColors ?? TICHA_BRAND_CONFETTI_COLORS;

  const frame = () => {
    // Left cannon
    safeConfetti({
      particleCount: 8,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
      shapes: ["square", "circle"],
      startVelocity: 45,
      scalar: 1.1,
    });

    // Right cannon
    safeConfetti({
      particleCount: 8,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
      shapes: ["square", "circle"],
      startVelocity: 45,
      scalar: 1.1,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

/**
 * Fiery gold and flame celebration specifically tuned for Streaks.
 */
export function fireStreakCelebration() {
  if (typeof window === "undefined") return;

  // Immediate powerful center burst with star shapes
  fireConfettiBurst({
    colors: TICHA_STREAK_CONFETTI_COLORS,
    particleCount: 200,
    shapes: ["star", "circle"],
    origin: { y: 0.6 },
  });

  // Continuous side cannons for 2.5 seconds
  fireSideCannons(2500, TICHA_STREAK_CONFETTI_COLORS);
}

/**
 * Grand celebration combining an initial blast + side cannons shower.
 * Perfect for Daily Lesson completion, Quiz completion, and Sign-up milestones.
 */
export function fireSuccessCelebration() {
  if (typeof window === "undefined") return;

  // Immediate high-energy blast
  fireConfettiBurst({
    particleCount: 220,
    origin: { y: 0.6 },
  });

  // Sustained side cannons
  fireSideCannons(2500, TICHA_BRAND_CONFETTI_COLORS);
}
