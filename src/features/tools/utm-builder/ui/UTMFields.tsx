"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { useUTMStore } from "../model/useUTMStore";
import { UTM_FIELD_INFO } from "../model/types";

const fieldKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function UTMFields() {
  const t = useTranslations("tools.utmBuilder.ui");
  const { params, setParams } = useUTMStore();

  return (
    <div className="space-y-4">
      <h3 className="font-medium">{t("utmParameters")}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fieldKeys.map((key) => {
          const info = UTM_FIELD_INFO[key];
          const value = params[key] || "";

          return (
            <div key={key} className="space-y-2">
              <Label
                htmlFor={key}
                className="flex items-center gap-2"
              >
                {t(`fields.${key}.label`)}
                {info.required && (
                  <span className="text-destructive">*</span>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px]">
                      <p className="text-sm">
                        {t(`fields.${key}.description`)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("examples")}: {info.examples.slice(0, 3).join(", ")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id={key}
                value={value}
                onChange={(e) =>
                  setParams({ [key]: e.target.value })
                }
                placeholder={t(`fields.${key}.placeholder`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
