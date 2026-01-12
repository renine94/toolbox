"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, AlertCircle, Copy, Trash2, ClipboardPaste } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { useCronStore } from "../model/useCronStore";

export function CronInput() {
  const t = useTranslations("tools.cronParser.ui");
  const tCommon = useTranslations("common");

  const { expression, parsed, setExpression, clear } = useCronStore();

  // 초기 파싱
  useEffect(() => {
    if (expression && !parsed) {
      setExpression(expression);
    }
  }, [expression, parsed, setExpression]);

  const handleCopy = async () => {
    if (!expression.trim()) {
      toast.error(t("toast.nothingToCopy"));
      return;
    }
    try {
      await navigator.clipboard.writeText(expression);
      toast.success(t("toast.copied"));
    } catch {
      toast.error(tCommon("toast.copyError"));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setExpression(text.trim());
      toast.success(t("toast.pasted"));
    } catch {
      toast.error(tCommon("toast.pasteError"));
    }
  };

  const handleClear = () => {
    clear();
    toast.success(t("toast.cleared"));
  };

  const isValid = parsed?.isValid ?? false;
  const hasInput = expression.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{t("expressionInput")}</h2>
        {hasInput && (
          <span
            className={`flex items-center gap-1 text-sm ${
              isValid ? "text-green-600 dark:text-green-400" : "text-destructive"
            }`}
          >
            {isValid ? (
              <>
                <Check className="h-4 w-4" />
                {t("valid")}
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                {t("invalid")}
              </>
            )}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={t("expressionPlaceholder")}
          className="font-mono text-lg"
          aria-label={t("expressionInput")}
          aria-invalid={hasInput && !isValid}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handlePaste}>
          <ClipboardPaste className="h-4 w-4 mr-2" />
          {tCommon("buttons.paste")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          {tCommon("buttons.copy")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          {tCommon("buttons.clear")}
        </Button>
      </div>

      {/* 에러 메시지 */}
      {hasInput && !isValid && parsed?.errors && parsed.errors.length > 0 && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <ul className="text-sm text-destructive space-y-1">
            {parsed.errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
