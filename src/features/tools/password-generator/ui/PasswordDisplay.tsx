"use client";

import { useTranslations } from "next-intl";
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { usePasswordStore } from "../model/usePasswordStore";
import { copyToClipboard } from "../lib/password-utils";
import { PasswordStrength } from "./PasswordStrength";

export function PasswordDisplay() {
  const { currentPassword, isVisible, generate, toggleVisibility } =
    usePasswordStore();
  const t = useTranslations("tools.passwordGenerator.ui");

  const handleCopy = async () => {
    if (!currentPassword) return;
    const success = await copyToClipboard(currentPassword.password);
    if (success) {
      toast.success(t("copied"));
    } else {
      toast.error(t("copyError"));
    }
  };

  const displayPassword = currentPassword
    ? isVisible
      ? currentPassword.password
      : "•".repeat(currentPassword.password.length)
    : t("generatePassword");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 p-4 bg-muted rounded-lg font-mono text-lg break-all">
          {displayPassword}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVisibility}
            disabled={!currentPassword}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!currentPassword}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={generate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <PasswordStrength password={currentPassword} />
    </div>
  );
}
