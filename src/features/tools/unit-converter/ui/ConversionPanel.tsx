'use client'

import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { getCategoryById, UnitCategoryId } from '../model/types'
import { copyToClipboard } from '../lib/converter-utils'

interface ConversionPanelProps {
  label: string
  categoryId: UnitCategoryId
  selectedUnit: string
  value: string
  onUnitChange: (unitId: string) => void
  onValueChange?: (value: string) => void
  readOnly?: boolean
}

export function ConversionPanel({
  label,
  categoryId,
  selectedUnit,
  value,
  onUnitChange,
  onValueChange,
  readOnly = false,
}: ConversionPanelProps) {
  const category = getCategoryById(categoryId)
  const units = category?.units || []

  const handleCopy = async () => {
    const success = await copyToClipboard(value)
    if (success) {
      toast.success('클립보드에 복사되었습니다')
    } else {
      toast.error('복사에 실패했습니다')
    }
  }

  return (
    <Card className="p-4 flex-1">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>

        <div className="relative">
          <Input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            readOnly={readOnly}
            className={`text-2xl font-mono h-14 pr-10 ${
              readOnly ? 'bg-muted/50' : ''
            }`}
            placeholder="0"
          />
          {readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select value={selectedUnit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{unit.symbol}</span>
                  <span className="text-muted-foreground">
                    ({unit.nameKo})
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}
