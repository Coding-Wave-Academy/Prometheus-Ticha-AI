/**
 * Web Vibration API helper for PWA touch interaction & feedback.
 * Safe for server-side rendering (SSR) and non-supported devices.
 */

export const isHapticsSupported = (): boolean => {
  return typeof window !== "undefined" && "vibrate" in navigator;
};

/** Gentle tap feedback (e.g. keypress, option selection, toggle) */
export const hapticTap = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate(8);
    } catch {
      // Ignore vibration failures if blocked by policy
    }
  }
};

/** Medium tap for button clicks */
export const hapticPress = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate(15);
    } catch {
      // Ignore
    }
  }
};

/** Success pulse pattern (e.g. form submission complete, lesson completed) */
export const hapticSuccess = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate([10, 30, 20]);
    } catch {
      // Ignore
    }
  }
};

/** Warning pulse pattern (e.g. invalid form field, password weak) */
export const hapticWarning = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate([20, 50, 20]);
    } catch {
      // Ignore
    }
  }
};

/** Heavy error triple-pulse pattern (e.g. system error, submission blocked) */
export const hapticError = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate([40, 60, 40, 60, 40]);
    } catch {
      // Ignore
    }
  }
};
