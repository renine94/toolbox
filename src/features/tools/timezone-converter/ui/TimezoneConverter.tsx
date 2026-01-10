"use client"

import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card"
import { useTimezoneStore } from "../model/useTimezoneStore"
import { TimeInput } from "./TimeInput"
import { TimezoneSelector } from "./TimezoneSelector"
import { TimezoneList } from "./TimezoneList"
import { QuickTimezones } from "./QuickTimezones"

export function TimezoneConverter() {
  const convert = useTimezoneStore((state) => state.convert)

  // 초기 변환 실행
  useEffect(() => {
    convert()
  }, [convert])

  return (
    <div className="space-y-6">
      <QuickTimezones />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>변환 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <TimezoneList />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <TimeInput />
          <TimezoneSelector />
        </div>
      </div>
    </div>
  )
}
