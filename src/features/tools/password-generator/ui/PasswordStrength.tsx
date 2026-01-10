"use client";

import { Progress } from "@/shared/ui/progress";
import { GeneratedPassword } from "../model/types";
import { getStrengthColor, getStrengthLabel } from "../lib/password-utils";

interface PasswordStrengthProps {
  password: GeneratedPassword | null;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { strength, score } = password;
  const color = getStrengthColor(strength);
  const label = getStrengthLabel(strength);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">비밀번호 강도</span>
        <span className="font-medium">{label}</span>
      </div>
      <Progress value={score} indicatorClassName={color} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
