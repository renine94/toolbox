export interface PasswordConfig {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeChars: string;
  excludeAmbiguous: boolean;
}

export interface GeneratedPassword {
  id: string;
  password: string;
  strength: PasswordStrength;
  score: number;
}

export type PasswordStrength = "weak" | "fair" | "good" | "strong" | "excellent";

export const DEFAULT_CONFIG: PasswordConfig = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeChars: "",
  excludeAmbiguous: false,
};

export const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "lI1O0",
} as const;
