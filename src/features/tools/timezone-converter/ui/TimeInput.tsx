"use client"

import { useEffect, useState } from "react"
import { Clock, RefreshCw, Globe } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useTimezoneStore } from "../model/useTimezoneStore"
import { getAllTimezones, getTimezoneName } from "../lib/timezone-utils"
import { POPULAR_TIMEZONES } from "../model/types"

export function TimeInput() {
  const {
    inputMode,
    sourceTimezone,
    sourceDateTime,
    settings,
    setInputMode,
    setSourceTimezone,
    setSourceDateTime,
    useCurrentTime,
    setSettings,
  } = useTimezoneStore()

  const [dateValue, setDateValue] = useState("")
  const [timeValue, setTimeValue] = useState("")

  // 현재 시간 모드일 때 1초마다 업데이트
  useEffect(() => {
    if (inputMode === "current") {
      const interval = setInterval(() => {
        useCurrentTime()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [inputMode, useCurrentTime])

  // sourceDateTime이 변경될 때 input 값 업데이트
  useEffect(() => {
    const date = new Date(sourceDateTime)
    setDateValue(date.toISOString().split("T")[0])
    setTimeValue(date.toTimeString().slice(0, 5))
  }, [sourceDateTime])

  const handleDateChange = (value: string) => {
    setDateValue(value)
    if (value && timeValue) {
      const newDate = new Date(`${value}T${timeValue}`)
      if (!isNaN(newDate.getTime())) {
        setSourceDateTime(newDate)
      }
    }
  }

  const handleTimeChange = (value: string) => {
    setTimeValue(value)
    if (dateValue && value) {
      const newDate = new Date(`${dateValue}T${value}`)
      if (!isNaN(newDate.getTime())) {
        setSourceDateTime(newDate)
      }
    }
  }

  const handleUseCurrentTime = () => {
    setInputMode("current")
    useCurrentTime()
  }

  const allTimezones = getAllTimezones()
  const sortedTimezones = [
    ...POPULAR_TIMEZONES,
    ...allTimezones.filter((tz) => !POPULAR_TIMEZONES.includes(tz)),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          시간 입력
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="current-time" className="cursor-pointer">
            현재 시간 사용
          </Label>
          <Switch
            id="current-time"
            checked={inputMode === "current"}
            onCheckedChange={(checked) => {
              if (checked) {
                handleUseCurrentTime()
              } else {
                setInputMode("custom")
              }
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={inputMode === "current"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">시간</Label>
            <Input
              id="time"
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={inputMode === "current"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            기준 시간대
          </Label>
          <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
            <SelectTrigger>
              <SelectValue placeholder="시간대 선택" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {sortedTimezones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {getTimezoneName(tz)} ({tz})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {inputMode === "custom" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleUseCurrentTime}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            현재 시간으로 설정
          </Button>
        )}

        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="time-format">24시간 형식</Label>
            <Switch
              id="time-format"
              checked={settings.timeFormat === "24h"}
              onCheckedChange={(checked) =>
                setSettings({ timeFormat: checked ? "24h" : "12h" })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-seconds">초 표시</Label>
            <Switch
              id="show-seconds"
              checked={settings.showSeconds}
              onCheckedChange={(checked) => setSettings({ showSeconds: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
