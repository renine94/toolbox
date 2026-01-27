"use client";

import { useTranslations } from "next-intl";
import { Code, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useMetaStore } from "../model/useMetaStore";
import { generateMetaTagsHtml } from "../lib/meta-utils";

export function CodeOutput() {
  const t = useTranslations("tools.metaTagPreviewer.ui");
  const tCommon = useTranslations("common.toast");

  const { metaTags, reset } = useMetaStore();

  const htmlCode = generateMetaTagsHtml(metaTags);

  const handleCopy = async () => {
    if (!htmlCode.trim()) {
      toast.error(t("nothingToCopy"));
      return;
    }

    try {
      await navigator.clipboard.writeText(htmlCode);
      toast.success(tCommon("copied"));
    } catch {
      toast.error(tCommon("copyError"));
    }
  };

  const handleReset = () => {
    reset();
    toast.success(t("resetSuccess"));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t("codeOutput")}
            </CardTitle>
            <CardDescription>{t("codeOutputDesc")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("reset")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              {t("copy")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <code className="text-foreground">
              {htmlCode || t("emptyCode")}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
