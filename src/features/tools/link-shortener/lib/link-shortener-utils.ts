import type { ShortenerApiResponse, ShortenerProvider } from "../model/types";
import { API_ENDPOINTS } from "../model/types";

/**
 * URL 단축 API 호출
 */
export async function shortenUrl(
  url: string,
  provider: ShortenerProvider
): Promise<ShortenerApiResponse> {
  const endpoint = API_ENDPOINTS[provider];
  const params = new URLSearchParams({
    format: "json",
    url: url,
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data: ShortenerApiResponse = await response.json();

  if (data.errorcode) {
    throw new Error(data.errormessage || "URL 단축에 실패했습니다");
  }

  if (!data.shorturl) {
    throw new Error("단축 URL을 받지 못했습니다");
  }

  return data;
}

/**
 * 클립보드에 텍스트 복사
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * URL 유효성 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * 날짜 포맷팅
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * URL 축약 표시 (긴 URL 줄이기)
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
}
