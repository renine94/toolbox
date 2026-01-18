"use client"

import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Label } from "@/shared/ui/label"
import { useSqlStore } from "../model/useSqlStore"
import {
  SQL_DIALECTS,
  INDENT_OPTIONS,
  KEYWORD_CASE_OPTIONS,
  type SqlDialect,
  type IndentType,
  type KeywordCase,
} from "../model/types"

export function SqlOptions() {
  const { options, setOptions } = useSqlStore()
  const t = useTranslations("tools.sqlFormatter.ui")

  return (
    <div className="flex flex-wrap gap-4">
      {/* SQL 방언 선택 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dialect-select" className="text-sm font-medium">
          {t("dialect")}
        </Label>
        <Select
          value={options.dialect}
          onValueChange={(value: SqlDialect) => setOptions({ dialect: value })}
        >
          <SelectTrigger id="dialect-select" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SQL_DIALECTS.map((dialect) => (
              <SelectItem key={dialect} value={dialect}>
                {t(`dialects.${dialect}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 들여쓰기 선택 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="indent-select" className="text-sm font-medium">
          {t("indent")}
        </Label>
        <Select
          value={options.indent}
          onValueChange={(value: IndentType) => setOptions({ indent: value })}
        >
          <SelectTrigger id="indent-select" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INDENT_OPTIONS.map((indent) => (
              <SelectItem key={indent} value={indent}>
                {t(`indentOptions.${indent}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 키워드 대소문자 선택 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="keyword-case-select" className="text-sm font-medium">
          {t("keywordCase")}
        </Label>
        <Select
          value={options.keywordCase}
          onValueChange={(value: KeywordCase) =>
            setOptions({ keywordCase: value })
          }
        >
          <SelectTrigger id="keyword-case-select" className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KEYWORD_CASE_OPTIONS.map((keywordCase) => (
              <SelectItem key={keywordCase} value={keywordCase}>
                {t(`keywordOptions.${keywordCase}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
