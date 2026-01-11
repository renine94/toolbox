"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useUuidStore } from "../model/useUuidStore";
import { UuidDisplay } from "./UuidDisplay";
import { UuidOptions } from "./UuidOptions";
import { BulkUuidList } from "./BulkUuidList";
import { UuidHistory } from "./UuidHistory";

export function UuidGenerator() {
  const generate = useUuidStore((state) => state.generate);
  const t = useTranslations("tools.uuidGenerator.ui");

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
              {t("titleDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UuidDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("options")}</CardTitle>
            <CardDescription>{t("optionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <UuidOptions />
            <div className="mt-6">
              <Button onClick={generate} className="w-full">
                {t("generateNew")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("bulkGenerate")}</CardTitle>
          <CardDescription>
            {t("bulkDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulkUuidList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("history")}</CardTitle>
          <CardDescription>
            {t("historyDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UuidHistory />
        </CardContent>
      </Card>
    </div>
  );
}
