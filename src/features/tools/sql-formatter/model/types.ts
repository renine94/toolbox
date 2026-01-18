/**
 * SQL Formatter 타입 정의
 * sql-formatter 라이브러리 기반
 */

export const SQL_DIALECTS = [
  'sql',
  'postgresql',
  'mysql',
  'mariadb',
  'sqlite',
  'transactsql',
  'plsql',
  'bigquery',
  'spark',
  'redshift',
] as const

export type SqlDialect = (typeof SQL_DIALECTS)[number]

export const INDENT_OPTIONS = ['2', '4', 'tab'] as const
export type IndentType = (typeof INDENT_OPTIONS)[number]

export const KEYWORD_CASE_OPTIONS = ['upper', 'lower', 'preserve'] as const
export type KeywordCase = (typeof KEYWORD_CASE_OPTIONS)[number]

export interface SqlFormatOptions {
  dialect: SqlDialect
  indent: IndentType
  keywordCase: KeywordCase
}

export interface SqlFormatterState {
  input: string
  output: string
  error: string | null
  options: SqlFormatOptions
  setInput: (input: string) => void
  setOutput: (output: string) => void
  setError: (error: string | null) => void
  setOptions: (options: Partial<SqlFormatOptions>) => void
  clear: () => void
}
