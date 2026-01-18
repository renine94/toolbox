"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Copy, Trash2, Minimize2 } from "lucide-react"
import { SqlInput } from "./SqlInput"
import { SqlOutput } from "./SqlOutput"
import { SqlOptions } from "./SqlOptions"
import { useSqlStore } from "../model/useSqlStore"
import { formatSql, minifySql, validateSql } from "../lib/formatter"
import { useDebounceValue } from "@/shared/hooks/use-debounce"

const DEBOUNCE_DELAY = 300

export function SqlFormatter() {
  const { input, output, options, setOutput, setError, clear } = useSqlStore()
  const t = useTranslations("tools.sqlFormatter.ui")
  const tCommon = useTranslations("common.toast")
  const isMinifyMode = useRef(false)

  // 디바운싱된 입력값
  const debouncedInput = useDebounceValue(input, DEBOUNCE_DELAY)

  // 디바운싱된 입력 또는 옵션 변경 시 자동 포맷팅
  useEffect(() => {
    if (isMinifyMode.current) {
      isMinifyMode.current = false
      return
    }

    if (!debouncedInput.trim()) {
      setError(null)
      setOutput("")
      return
    }

    const validation = validateSql(debouncedInput)
    if (!validation.valid) {
      setError(validation.error || null)
      setOutput("")
      return
    }

    try {
      const formatted = formatSql(debouncedInput, options)
      setOutput(formatted)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : null
      setError(errorMessage)
      setOutput("")
    }
  }, [debouncedInput, options, setOutput, setError])

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setError(null)
      setOutput("")
      return
    }

    const validation = validateSql(input)
    if (!validation.valid) {
      setError(validation.error || t("formatError"))
      setOutput("")
      return
    }

    try {
      isMinifyMode.current = true
      const minified = minifySql(input)
      setOutput(minified)
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("formatError")
      setError(errorMessage)
      setOutput("")
    }
  }, [input, setOutput, setError, t])

  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.error(t("nothingToCopy"))
      return
    }

    try {
      await navigator.clipboard.writeText(output)
      toast.success(tCommon("copied"))
    } catch {
      toast.error(tCommon("copyError"))
    }
  }, [output, t, tCommon])

  const handleClear = useCallback(() => {
    clear()
  }, [clear])

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] gap-4">
      {/* 컨트롤 패널 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <SqlOptions />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleMinify} variant="secondary" className="gap-2">
            <Minimize2 className="w-4 h-4" />
            {t("minify")}
          </Button>
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            <Copy className="w-4 h-4" />
            {t("copy")}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            {t("clear")}
          </Button>
        </div>
      </div>

      {/* 입력/출력 패널 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <SqlInput />
        <SqlOutput />
      </div>
    </div>
  )
}
