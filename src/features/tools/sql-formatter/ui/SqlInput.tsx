"use client"

import { useTranslations } from "next-intl"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import { useSqlStore } from "../model/useSqlStore"

export function SqlInput() {
  const { input, setInput } = useSqlStore()
  const t = useTranslations("tools.sqlFormatter.ui")

  return (
    <div className="flex flex-col gap-2 h-full">
      <Label htmlFor="sql-input" className="text-lg font-medium">
        {t("inputLabel")}
      </Label>
      <Textarea
        id="sql-input"
        placeholder={t("inputPlaceholder")}
        className="flex-1 font-mono text-sm resize-none p-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  )
}
