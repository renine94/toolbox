/**
 * SQL Formatter 유틸리티
 * sql-formatter 라이브러리 래퍼
 */

import { format } from 'sql-formatter'
import type { SqlDialect, IndentType, KeywordCase, SqlFormatOptions } from '../model/types'

/**
 * IndentType을 sql-formatter 옵션으로 변환
 */
function getIndentConfig(indent: IndentType): { tabWidth: number; useTabs: boolean } {
  switch (indent) {
    case 'tab':
      return { tabWidth: 4, useTabs: true }
    case '4':
      return { tabWidth: 4, useTabs: false }
    case '2':
    default:
      return { tabWidth: 2, useTabs: false }
  }
}

/**
 * SQL 쿼리 포맷팅
 */
export function formatSql(sql: string, options: SqlFormatOptions): string {
  if (!sql.trim()) {
    return ''
  }

  const indentConfig = getIndentConfig(options.indent)

  return format(sql, {
    language: options.dialect,
    tabWidth: indentConfig.tabWidth,
    useTabs: indentConfig.useTabs,
    keywordCase: options.keywordCase,
    linesBetweenQueries: 2,
  })
}

/**
 * SQL 쿼리 압축 (공백/줄바꿈 최소화)
 */
export function minifySql(sql: string): string {
  if (!sql.trim()) {
    return ''
  }

  return sql
    .replace(/--.*$/gm, '') // 단일 라인 주석 제거
    .replace(/\/\*[\s\S]*?\*\//g, '') // 멀티 라인 주석 제거
    .replace(/\s+/g, ' ') // 연속 공백을 단일 공백으로
    .replace(/\s*([,;()])\s*/g, '$1') // 구분자 주변 공백 제거
    .replace(/\(\s+/g, '(') // 괄호 후 공백 제거
    .replace(/\s+\)/g, ')') // 괄호 전 공백 제거
    .trim()
}

/**
 * SQL 유효성 기본 검사 (간단한 문법 체크)
 */
export function validateSql(sql: string): { valid: boolean; error?: string } {
  if (!sql.trim()) {
    return { valid: true }
  }

  // 괄호 짝 검사
  let parenCount = 0
  for (const char of sql) {
    if (char === '(') parenCount++
    if (char === ')') parenCount--
    if (parenCount < 0) {
      return { valid: false, error: 'Unmatched closing parenthesis' }
    }
  }
  if (parenCount > 0) {
    return { valid: false, error: 'Unmatched opening parenthesis' }
  }

  // 문자열 리터럴 검사 (작은따옴표)
  const singleQuotes = (sql.match(/'/g) || []).length
  if (singleQuotes % 2 !== 0) {
    return { valid: false, error: 'Unterminated string literal' }
  }

  return { valid: true }
}
