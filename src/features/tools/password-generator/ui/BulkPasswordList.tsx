"use client";

import { useTranslations } from "next-intl";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Badge } from "@/shared/ui/badge";
import { usePasswordStore } from "../model/usePasswordStore";
import {
  copyToClipboard,
  getStrengthColor,
} from "../lib/password-utils";
import type { PasswordStrength } from "../model/types";

export function BulkPasswordList() {
  const { bulkCount, bulkPasswords, setBulkCount, generateBulk, clearBulk } =
    usePasswordStore();
  const t = useTranslations("tools.passwordGenerator.ui");

  const getStrengthLabel = (strength: PasswordStrength): string => {
    return t(`strengthLabels.${strength}`);
  };

  const handleCopyOne = async (password: string) => {
    const success = await copyToClipboard(password);
    if (success) {
      toast.success(t("copied"));
    } else {
      toast.error(t("copyError"));
    }
  };

  const handleCopyAll = async () => {
    const allPasswords = bulkPasswords.map((p) => p.password).join("\n");
    const success = await copyToClipboard(allPasswords);
    if (success) {
      toast.success(t("copiedCount", { count: bulkPasswords.length }));
    } else {
      toast.error(t("copyError"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{t("quantity")}</Label>
          <span className="text-sm font-medium">{bulkCount}{t("quantityUnit")}</span>
        </div>
        <Slider
          value={[bulkCount]}
          onValueChange={([value]) => setBulkCount(value)}
          min={1}
          max={10}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generateBulk} className="flex-1">
          {t("generateCount", { count: bulkCount })}
        </Button>
        {bulkPasswords.length > 0 && (
          <>
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" />
              {t("copyAll")}
            </Button>
            <Button variant="outline" onClick={clearBulk}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {bulkPasswords.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {bulkPasswords.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-3 bg-muted rounded-lg group"
            >
              <span className="text-xs text-muted-foreground w-6">
                {index + 1}.
              </span>
              <span className="flex-1 font-mono text-sm break-all">
                {item.password}
              </span>
              <Badge
                variant="secondary"
                className={`text-white ${getStrengthColor(item.strength)}`}
              >
                {getStrengthLabel(item.strength)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopyOne(item.password)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
