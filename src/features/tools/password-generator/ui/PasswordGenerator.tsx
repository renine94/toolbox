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
import { usePasswordStore } from "../model/usePasswordStore";
import { PasswordDisplay } from "./PasswordDisplay";
import { PasswordOptions } from "./PasswordOptions";
import { BulkPasswordList } from "./BulkPasswordList";

export function PasswordGenerator() {
  const generate = usePasswordStore((state) => state.generate);
  const t = useTranslations("tools.passwordGenerator.ui");

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("password")}</CardTitle>
            <CardDescription>
              {t("passwordDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("options")}</CardTitle>
            <CardDescription>{t("optionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordOptions />
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
          <BulkPasswordList />
        </CardContent>
      </Card>
    </div>
  );
}
