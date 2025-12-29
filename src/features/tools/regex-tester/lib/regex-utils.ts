import { RegexFlag, RegexMatch, RegexResult } from "../model/types";

/**
 * Test a regex pattern against text and return all matches
 */
export function testRegex(
  pattern: string,
  text: string,
  flags: RegexFlag[]
): RegexResult {
  if (!pattern) {
    return {
      matches: [],
      totalMatches: 0,
      error: null,
    };
  }

  try {
    const flagString = flags.join("");
    const regex = new RegExp(pattern, flagString);

    const matches: RegexMatch[] = [];

    if (flags.includes("g")) {
      // Global flag - find all matches
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index,
          length: match[0].length,
        });

        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      // Non-global - find first match only
      const match = regex.exec(text);
      if (match) {
        matches.push({
          fullMatch: match[0],
          groups: match.slice(1),
          index: match.index,
          length: match[0].length,
        });
      }
    }

    return {
      matches,
      totalMatches: matches.length,
      error: null,
    };
  } catch (err: unknown) {
    return {
      matches: [],
      totalMatches: 0,
      error: err instanceof Error ? err.message : "Invalid regex pattern",
    };
  }
}

/**
 * Check if a regex pattern is valid
 */
export function isValidRegex(
  pattern: string,
  flags: RegexFlag[]
): { valid: boolean; error?: string } {
  if (!pattern) {
    return { valid: true };
  }

  try {
    new RegExp(pattern, flags.join(""));
    return { valid: true };
  } catch (err: unknown) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Invalid regex pattern",
    };
  }
}

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate a unique ID for history items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
