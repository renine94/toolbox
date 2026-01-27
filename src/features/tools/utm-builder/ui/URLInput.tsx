"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useUTMStore } from "../model/useUTMStore";
import { isValidUrl } from "../lib/utm-utils";

export function URLInput() {
  const t = useTranslations("tools.utmBuilder.ui");
  const { baseUrl, setBaseUrl } = useUTMStore();
  const [touched, setTouched] = useState(false);

  const isValid = baseUrl === "" || isValidUrl(baseUrl);
  const showError = touched && baseUrl !== "" && !isValid;
  const showSuccess = baseUrl !== "" && isValid;

  return (
    <div className="space-y-2">
      <Label htmlFor="base-url" className="flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        {t("baseUrl")}
        <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Input
          id="base-url"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={t("baseUrlPlaceholder")}
          className={`pr-10 ${
            showError
              ? "border-destructive focus-visible:ring-destructive"
              : showSuccess
              ? "border-green-500 focus-visible:ring-green-500"
              : ""
          }`}
        />
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
        {showSuccess && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {showError && (
        <p className="text-sm text-destructive">{t("invalidUrl")}</p>
      )}
      <p className="text-xs text-muted-foreground">{t("baseUrlDescription")}</p>
    </div>
  );
}
