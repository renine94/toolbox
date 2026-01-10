"use client"

import { Copy, X, Star, ArrowRight, ArrowLeft } from "lucide-react"
import { Card } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { toast } from "sonner"
import { ConvertedTime } from "../model/types"
import { useTimezoneStore } from "../model/useTimezoneStore"
import { copyToClipboard } from "../lib/timezone-utils"

interface TimezoneCardProps {
  convertedTime: ConvertedTime
}

export function TimezoneCard({ convertedTime }: TimezoneCardProps) {
  const { removeTargetTimezone, addFavorite, removeFavorite, isFavorite } =
    useTimezoneStore()

  const { timezone, formattedTime, formattedDate, isNextDay, isPrevDay } =
    convertedTime

  const favorite = isFavorite(timezone.id)

  const handleCopy = async () => {
    const text = `${timezone.name} (${timezone.abbreviation}): ${formattedTime} ${formattedDate}`
    const success = await copyToClipboard(text)
    if (success) {
      toast.success("클립보드에 복사되었습니다")
    } else {
      toast.error("복사에 실패했습니다")
    }
  }

  const handleRemove = () => {
    removeTargetTimezone(timezone.id)
  }

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(timezone.id)
      toast.success("즐겨찾기에서 제거되었습니다")
    } else {
      addFavorite(timezone.id)
      toast.success("즐겨찾기에 추가되었습니다")
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{timezone.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {timezone.abbreviation}
            </Badge>
            <Badge variant="outline" className="text-xs">
              UTC{timezone.offset}
            </Badge>
            {isNextDay && (
              <Badge variant="default" className="text-xs gap-1">
                <ArrowRight className="h-3 w-3" />
                다음날
              </Badge>
            )}
            {isPrevDay && (
              <Badge variant="default" className="text-xs gap-1">
                <ArrowLeft className="h-3 w-3" />
                전날
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {timezone.id}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggleFavorite}
          >
            <Star
              className={`h-4 w-4 ${favorite ? "fill-yellow-400 text-yellow-400" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tabular-nums">{formattedTime}</div>
        <div className="text-sm text-muted-foreground mt-1">{formattedDate}</div>
      </div>
    </Card>
  )
}
