import { Metadata } from "next"
import { TimezoneConverter } from "@/features/tools/timezone-converter"

export const metadata: Metadata = {
  title: "Timezone Converter | Toolbox",
  description:
    "다양한 시간대 간 시간을 변환합니다. 여러 시간대를 동시에 비교하고 빠르게 변환하세요.",
}

export default function TimezoneConverterPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Timezone Converter</h1>
        <p className="text-muted-foreground mt-2">
          다양한 시간대 간 시간을 변환합니다. 여러 시간대를 동시에 비교하고
          빠르게 변환하세요.
        </p>
      </div>
      <TimezoneConverter />
    </div>
  )
}
