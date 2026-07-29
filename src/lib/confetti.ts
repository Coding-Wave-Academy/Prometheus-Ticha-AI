import confetti from "canvas-confetti";

/**
 * Triggers a realistic physics-based confetti burst using canvas-confetti.
 */
export function fireConfettiBurst() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#B6FF00", "#FFB040", "#965A18", "#1A1A1A", "#FFFFFF"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Fires side cannon confetti for major achievements like streak milestones.
 */
export function fireSideCannons() {
  const end = Date.now() + 1.5 * 1000;
  const colors = ["#B6FF00", "#FFB040", "#965A18"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
