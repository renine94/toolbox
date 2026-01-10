"use client"

import { Star } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { useTimezoneStore } from "../model/useTimezoneStore"
import { getTimezoneName } from "../lib/timezone-utils"
import { POPULAR_TIMEZONES } from "../model/types"

export function QuickTimezones() {
  const { targetTimezones, favoriteTimezones, addTargetTimezone } =
    useTimezoneStore()

  const handleAdd = (timezone: string) => {
    addTargetTimezone(timezone)
  }

  const isAdded = (timezone: string) => targetTimezones.includes(timezone)

  // 즐겨찾기와 인기 시간대 합치기 (중복 제거)
  const quickTimezones = [
    ...favoriteTimezones,
    ...POPULAR_TIMEZONES.filter((tz) => !favoriteTimezones.includes(tz)),
  ].slice(0, 10)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Star className="h-4 w-4" />
        <span>빠른 추가</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickTimezones.map((tz) => {
          const added = isAdded(tz)
          const isFavorite = favoriteTimezones.includes(tz)

          return (
            <Button
              key={tz}
              variant={added ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleAdd(tz)}
              disabled={added}
              className="gap-1"
            >
              {isFavorite && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
              {getTimezoneName(tz)}
              {added && (
                <Badge variant="secondary" className="ml-1 text-xs px-1">
                  추가됨
                </Badge>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
