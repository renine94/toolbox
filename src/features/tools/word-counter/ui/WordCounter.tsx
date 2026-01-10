'use client'

import { TextInput } from './TextInput'
import { StatsPanel } from './StatsPanel'

export function WordCounter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
      <TextInput />
      <StatsPanel />
    </div>
  )
}
