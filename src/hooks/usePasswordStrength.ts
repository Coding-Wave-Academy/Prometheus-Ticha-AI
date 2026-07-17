/**
 * usePasswordStrength — dynamic password strength checker hook
 *
 * Returns a strength level (0-4), label, color token, and
 * an array of individual checks so the UI can display granular feedback.
 */

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export interface PasswordStrength {
  /** 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong */
  score: number;
  label: string;
  /** Tailwind bg-color class */
  color: string;
  /** Percentage fill for a progress bar (0–100) */
  percent: number;
  checks: PasswordCheck[];
}

export function usePasswordStrength(password: string): PasswordStrength {
  const checks: PasswordCheck[] = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Lowercase letter", passed: /[a-z]/.test(password) },
    { label: "Number", passed: /[0-9]/.test(password) },
    { label: "Special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = password.length === 0 ? 0 : checks.filter((c) => c.passed).length;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Too Weak", color: "bg-stone-300" },
    1: { label: "Weak", color: "bg-red-500" },
    2: { label: "Fair", color: "bg-orange-400" },
    3: { label: "Good", color: "bg-yellow-400" },
    4: { label: "Strong", color: "bg-[#B6FF00]" },
    5: { label: "Very Strong", color: "bg-green-500" },
  };

  const { label, color } = map[score] ?? map[0];

  return {
    score,
    label,
    color,
    percent: (score / 5) * 100,
    checks,
  };
}
