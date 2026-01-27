"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { useTranslations } from "next-intl";
import { Settings2 } from "lucide-react";
import { URLInput } from "./URLInput";
import { UTMFields } from "./UTMFields";
import { GeneratedURL } from "./GeneratedURL";
import { UTMPresets } from "./UTMPresets";
import { UTMHistory } from "./UTMHistory";

export function UTMBuilder() {
  const t = useTranslations("tools.utmBuilder.ui");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 왼쪽: 입력 폼 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {t("builder")}
            </CardTitle>
            <CardDescription>{t("builderDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <URLInput />
            <Separator />
            <UTMFields />
          </CardContent>
        </Card>

        <UTMPresets />
      </div>

      {/* 오른쪽: 결과 및 히스토리 */}
      <div className="space-y-6">
        <GeneratedURL />
        <UTMHistory />
      </div>
    </div>
  );
}
