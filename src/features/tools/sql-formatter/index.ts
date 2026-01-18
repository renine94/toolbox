/**
 * SQL Formatter Public API
 */

// UI Components
export { SqlFormatter } from './ui/SqlFormatter'
export { SqlInput } from './ui/SqlInput'
export { SqlOutput } from './ui/SqlOutput'
export { SqlOptions } from './ui/SqlOptions'

// Store
export { useSqlStore } from './model/useSqlStore'

// Utilities
export { formatSql, minifySql, validateSql } from './lib/formatter'

// Types
export type {
  SqlDialect,
  IndentType,
  KeywordCase,
  SqlFormatOptions,
  SqlFormatterState,
} from './model/types'

export { SQL_DIALECTS, INDENT_OPTIONS, KEYWORD_CASE_OPTIONS } from './model/types'
