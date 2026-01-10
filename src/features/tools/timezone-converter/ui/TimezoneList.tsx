"use client"

import { Globe, Copy, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { toast } from "sonner"
import { useTimezoneStore } from "../model/useTimezoneStore"
import { TimezoneCard } from "./TimezoneCard"
import { copyToClipboard, generateShareText } from "../lib/timezone-utils"

export function TimezoneList() {
  const { convertedTimes, clearTargetTimezones } = useTimezoneStore()

  const handleCopyAll = async () => {
    if (convertedTimes.length === 0) {
      toast.error("복사할 시간대가 없습니다")
      return
    }

    const text = generateShareText(convertedTimes)
    const success = await copyToClipboard(text)
    if (success) {
      toast.success("모든 시간대가 복사되었습니다")
    } else {
      toast.error("복사에 실패했습니다")
    }
  }

  const handleClearAll = () => {
    clearTargetTimezones()
    toast.success("모든 시간대가 삭제되었습니다")
  }

  if (convertedTimes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Globe className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">시간대를 추가해주세요</h3>
        <p className="text-sm text-muted-foreground mt-1">
          오른쪽 패널에서 시간대를 검색하고 추가할 수 있습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          변환된 시간대 ({convertedTimes.length}개)
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <Copy className="h-4 w-4 mr-2" />
            전체 복사
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            전체 삭제
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {convertedTimes.map((ct) => (
          <TimezoneCard key={ct.id} convertedTime={ct} />
        ))}
      </div>
    </div>
  )
}
