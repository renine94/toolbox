"use client"

import { useTranslations } from "next-intl"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { useSqlStore } from "../model/useSqlStore"

export function SqlOutput() {
  const { output, error } = useSqlStore()
  const t = useTranslations("tools.sqlFormatter.ui")

  return (
    <div className="flex flex-col gap-2 h-full">
      <Label htmlFor="sql-output" className="text-lg font-medium">
        {t("outputLabel")}
        {error && (
          <span className="text-destructive ml-2 text-sm">({error})</span>
        )}
      </Label>
      <Textarea
        id="sql-output"
        readOnly
        placeholder={t("outputPlaceholder")}
        className={`flex-1 font-mono text-sm resize-none p-4 ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }`}
        value={output}
      />
    </div>
  )
}
