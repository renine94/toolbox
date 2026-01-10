'use client'

import {
  FileText,
  Type,
  AlignLeft,
  Pilcrow,
  Clock,
  MessageSquare,
  Copy,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { useWordCounterStore } from '../model/useWordCounterStore'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  subLabel?: string
}

function StatCard({ icon, label, value, subLabel }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subLabel && (
        <div className="text-xs text-muted-foreground mt-1">{subLabel}</div>
      )}
    </Card>
  )
}

export function StatsPanel() {
  const { stats } = useWordCounterStore()

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return '0분'
    if (minutes < 1) return '1분 미만'
    return `${minutes}분`
  }

  const handleCopy = () => {
    const statsText = `단어 수: ${stats.wordCount}
문자 수 (공백 포함): ${stats.charCount}
문자 수 (공백 제외): ${stats.charNoSpaceCount}
줄 수: ${stats.lineCount}
문단 수: ${stats.paragraphCount}
읽기 시간: ${formatTime(stats.readingTime)}
말하기 시간: ${formatTime(stats.speakingTime)}`

    navigator.clipboard.writeText(statsText)
    toast.success('통계가 클립보드에 복사되었습니다')
  }

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium">통계</Label>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1" />
          복사
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="단어 수"
          value={stats.wordCount.toLocaleString()}
        />
        <StatCard
          icon={<Type className="h-4 w-4" />}
          label="문자 수"
          value={stats.charCount.toLocaleString()}
          subLabel="공백 포함"
        />
        <StatCard
          icon={<Type className="h-4 w-4" />}
          label="문자 수"
          value={stats.charNoSpaceCount.toLocaleString()}
          subLabel="공백 제외"
        />
        <StatCard
          icon={<AlignLeft className="h-4 w-4" />}
          label="줄 수"
          value={stats.lineCount.toLocaleString()}
        />
        <StatCard
          icon={<Pilcrow className="h-4 w-4" />}
          label="문단 수"
          value={stats.paragraphCount.toLocaleString()}
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="읽기 시간"
          value={formatTime(stats.readingTime)}
          subLabel="200 WPM 기준"
        />
        <StatCard
          icon={<MessageSquare className="h-4 w-4" />}
          label="말하기 시간"
          value={formatTime(stats.speakingTime)}
          subLabel="150 WPM 기준"
        />
      </div>
    </Card>
  )
}
