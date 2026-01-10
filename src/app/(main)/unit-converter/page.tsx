import { Metadata } from 'next'
import { UnitConverter } from '@/features/tools/unit-converter'

export const metadata: Metadata = {
  title: 'Unit Converter - Developer Tools',
  description:
    '길이, 무게, 온도, 부피, 면적, 속도, 데이터, 시간 등 다양한 단위를 쉽고 빠르게 변환하세요.',
}

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📐 Unit Converter</h1>
          <p className="text-muted-foreground">
            길이, 무게, 온도, 부피, 면적, 속도, 데이터, 시간 등 다양한 단위를
            쉽고 빠르게 변환하세요.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <UnitConverter />
        </div>
      </main>
    </div>
  )
}
