/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    } catch {
      return false;
    }
  }
}

/**
 * Format selected items for display
 */
export function formatSelectedCount(emojis: string[], hashtags: string[]): string {
  const parts: string[] = [];

  if (emojis.length > 0) {
    parts.push(`${emojis.length} emoji`);
  }

  if (hashtags.length > 0) {
    parts.push(`${hashtags.length} hashtag`);
  }

  return parts.join(", ");
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
