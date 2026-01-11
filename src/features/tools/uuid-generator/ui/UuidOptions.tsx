"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useUuidStore } from "../model/useUuidStore";
import { type UuidVersion } from "../model/types";

const UUID_VERSIONS: UuidVersion[] = ["v1", "v4", "v7"];

export function UuidOptions() {
  const config = useUuidStore((state) => state.config);
  const setVersion = useUuidStore((state) => state.setVersion);
  const setUppercase = useUuidStore((state) => state.setUppercase);
  const setHyphens = useUuidStore((state) => state.setHyphens);
  const setBraces = useUuidStore((state) => state.setBraces);
  const t = useTranslations("tools.uuidGenerator.ui");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("version")}</Label>
        <Select
          value={config.version}
          onValueChange={(value) => setVersion(value as UuidVersion)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UUID_VERSIONS.map((version) => (
              <SelectItem key={version} value={version}>
                <div className="flex flex-col">
                  <span className="font-medium">{t(`versions.${version}.name`)}</span>
                  <span className="text-xs text-muted-foreground">
                    {t(`versions.${version}.description`)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="uppercase">{t("uppercase")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("uppercaseDescription")}
            </p>
          </div>
          <Switch
            id="uppercase"
            checked={config.uppercase}
            onCheckedChange={setUppercase}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="hyphens">{t("hyphens")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("hyphensDescription")}
            </p>
          </div>
          <Switch
            id="hyphens"
            checked={config.hyphens}
            onCheckedChange={setHyphens}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="braces">{t("braces")}</Label>
            <p className="text-xs text-muted-foreground">
              {t("bracesDescription")}
            </p>
          </div>
          <Switch
            id="braces"
            checked={config.braces}
            onCheckedChange={setBraces}
          />
        </div>
      </div>
    </div>
  );
}
