"use client";

import { useTranslations } from "next-intl";
import { Dices } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { useFakeDataStore } from "../model/useFakeDataStore";
import { GeneratorOptions } from "./GeneratorOptions";
import { FieldSelector } from "./FieldSelector";
import { DataDisplay } from "./DataDisplay";

export function FakeDataGenerator() {
  const t = useTranslations("tools.fakeDataGenerator.ui");

  const isGenerating = useFakeDataStore((state) => state.isGenerating);
  const generate = useFakeDataStore((state) => state.generate);
  const config = useFakeDataStore((state) => state.config);

  const enabledFieldsCount = config.fields.filter((f) => f.enabled).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* 왼쪽: 출력 영역 */}
      <Card className="order-2 lg:order-1">
        <CardContent className="pt-6">
          <DataDisplay />
        </CardContent>
      </Card>

      {/* 오른쪽: 옵션 패널 */}
      <Card className="order-1 lg:order-2">
        <CardHeader>
          <CardTitle>{t("options")}</CardTitle>
          <CardDescription>{t("optionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 생성 옵션 */}
          <GeneratorOptions />

          <Separator />

          {/* 필드 선택 */}
          <div>
            <h3 className="font-medium mb-3">{t("fields")}</h3>
            <FieldSelector />
          </div>

          <Separator />

          {/* 생성 버튼 */}
          <Button
            className="w-full"
            size="lg"
            onClick={generate}
            disabled={isGenerating || enabledFieldsCount === 0}
          >
            <Dices className="w-5 h-5 mr-2" />
            {isGenerating ? t("generating") : t("generate")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
