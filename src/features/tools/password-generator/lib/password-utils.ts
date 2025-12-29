import {
  PasswordConfig,
  PasswordStrength,
  GeneratedPassword,
  CHAR_SETS,
} from "../model/types";

export function generatePassword(config: PasswordConfig): string {
  let chars = "";

  if (config.uppercase) chars += CHAR_SETS.uppercase;
  if (config.lowercase) chars += CHAR_SETS.lowercase;
  if (config.numbers) chars += CHAR_SETS.numbers;
  if (config.symbols) chars += CHAR_SETS.symbols;

  if (config.excludeAmbiguous) {
    for (const char of CHAR_SETS.ambiguous) {
      chars = chars.replace(new RegExp(char, "g"), "");
    }
  }

  if (config.excludeChars) {
    for (const char of config.excludeChars) {
      chars = chars.replace(new RegExp(escapeRegex(char), "g"), "");
    }
  }

  if (chars.length === 0) {
    chars = CHAR_SETS.lowercase;
  }

  let password = "";
  const array = new Uint32Array(config.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < config.length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function calculateStrength(password: string): number {
  if (!password) return 0;

  let score = 0;
  const length = password.length;

  // Length score (max 40)
  if (length >= 8) score += 10;
  if (length >= 12) score += 10;
  if (length >= 16) score += 10;
  if (length >= 24) score += 10;

  // Character diversity (max 40)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  // Bonus for mixing (max 20)
  const types = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;

  if (types >= 3) score += 10;
  if (types === 4) score += 10;

  // Penalties
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/^[a-zA-Z]+$/.test(password)) score -= 5; // Only letters
  if (/^[0-9]+$/.test(password)) score -= 10; // Only numbers

  return Math.max(0, Math.min(100, score));
}

export function getStrengthLevel(score: number): PasswordStrength {
  if (score < 30) return "weak";
  if (score < 50) return "fair";
  if (score < 70) return "good";
  if (score < 90) return "strong";
  return "excellent";
}

export function getStrengthColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: "bg-red-500",
    fair: "bg-orange-500",
    good: "bg-yellow-500",
    strong: "bg-green-500",
    excellent: "bg-emerald-500",
  };
  return colors[strength];
}

export function getStrengthLabel(strength: PasswordStrength): string {
  const labels: Record<PasswordStrength, string> = {
    weak: "약함",
    fair: "보통",
    good: "양호",
    strong: "강함",
    excellent: "매우 강함",
  };
  return labels[strength];
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function createGeneratedPassword(
  config: PasswordConfig
): GeneratedPassword {
  const password = generatePassword(config);
  const score = calculateStrength(password);
  const strength = getStrengthLevel(score);

  return {
    id: crypto.randomUUID(),
    password,
    strength,
    score,
  };
}

export function generateBulkPasswords(
  config: PasswordConfig,
  count: number
): GeneratedPassword[] {
  return Array.from({ length: count }, () => createGeneratedPassword(config));
}
