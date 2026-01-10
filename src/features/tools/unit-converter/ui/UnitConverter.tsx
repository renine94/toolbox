'use client'

import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { ArrowRightLeft, RotateCcw, Lightbulb } from 'lucide-react'
import { useUnitConverterStore } from '../model/useUnitConverterStore'
import { CategorySelector } from './CategorySelector'
import { ConversionPanel } from './ConversionPanel'

export function UnitConverter() {
  const {
    categoryId,
    fromUnit,
    toUnit,
    inputValue,
    result,
    formula,
    setFromUnit,
    setToUnit,
    setInputValue,
    swap,
    reset,
  } = useUnitConverterStore()

  return (
    <div className="space-y-6">
      {/* 카테고리 선택 */}
      <Card className="p-4">
        <CategorySelector />
      </Card>

      {/* 변환 영역 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* From 패널 */}
        <ConversionPanel
          label="변환할 값"
          categoryId={categoryId}
          selectedUnit={fromUnit}
          value={inputValue}
          onUnitChange={setFromUnit}
          onValueChange={setInputValue}
        />

        {/* Swap 버튼 */}
        <div className="flex md:flex-col items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={swap}
            className="rounded-full h-12 w-12 shrink-0"
          >
            <ArrowRightLeft className="h-5 w-5 md:rotate-90" />
          </Button>
        </div>

        {/* To 패널 */}
        <ConversionPanel
          label="변환 결과"
          categoryId={categoryId}
          selectedUnit={toUnit}
          value={result}
          onUnitChange={setToUnit}
          readOnly
        />
      </div>

      {/* 변환 공식 및 초기화 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span className="font-mono">{formula}</span>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          초기화
        </Button>
      </div>
    </div>
  )
}
