"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { ScrollArea } from "@/shared/ui/scroll-area"
import { Badge } from "@/shared/ui/badge"
import { useTimezoneStore } from "../model/useTimezoneStore"
import {
  getAllTimezones,
  getTimezoneName,
  searchTimezones,
  getTimezoneInfo,
} from "../lib/timezone-utils"
import { POPULAR_TIMEZONES } from "../model/types"

export function TimezoneSelector() {
  const { targetTimezones, addTargetTimezone } = useTimezoneStore()
  const [query, setQuery] = useState("")

  const allTimezones = useMemo(() => getAllTimezones(), [])

  const filteredTimezones = useMemo(() => {
    if (!query.trim()) {
      // 검색어가 없으면 인기 시간대 우선 표시
      return [
        ...POPULAR_TIMEZONES,
        ...allTimezones.filter((tz) => !POPULAR_TIMEZONES.includes(tz)),
      ]
    }
    return searchTimezones(query, allTimezones)
  }, [query, allTimezones])

  const handleAdd = (timezone: string) => {
    addTargetTimezone(timezone)
  }

  const isAdded = (timezone: string) => targetTimezones.includes(timezone)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          시간대 추가
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="시간대 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-1">
            {filteredTimezones.slice(0, 50).map((tz) => {
              const info = getTimezoneInfo(tz)
              const added = isAdded(tz)
              const isPopular = POPULAR_TIMEZONES.includes(tz)

              return (
                <Button
                  key={tz}
                  variant={added ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => handleAdd(tz)}
                  disabled={added}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">
                        {getTimezoneName(tz)}
                      </span>
                      {isPopular && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          인기
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        UTC{info.offset}
                      </span>
                      {added && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                </Button>
              )
            })}
            {filteredTimezones.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                검색 결과가 없습니다
              </div>
            )}
            {filteredTimezones.length > 50 && (
              <div className="text-center text-muted-foreground py-2 text-sm">
                검색어를 입력하여 더 많은 결과를 확인하세요
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
