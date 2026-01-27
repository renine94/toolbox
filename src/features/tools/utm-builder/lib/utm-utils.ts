import type { UTMParams } from "../model/types";

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * UTM 파라미터를 포함한 URL 생성
 */
export function buildUTMUrl(baseUrl: string, params: UTMParams): string {
  try {
    const url = new URL(baseUrl);

    // 필수 파라미터
    if (params.utm_source) {
      url.searchParams.set("utm_source", params.utm_source);
    }
    if (params.utm_medium) {
      url.searchParams.set("utm_medium", params.utm_medium);
    }
    if (params.utm_campaign) {
      url.searchParams.set("utm_campaign", params.utm_campaign);
    }

    // 선택 파라미터
    if (params.utm_term) {
      url.searchParams.set("utm_term", params.utm_term);
    }
    if (params.utm_content) {
      url.searchParams.set("utm_content", params.utm_content);
    }

    return url.toString();
  } catch {
    return "";
  }
}

/**
 * URL에서 UTM 파라미터 추출
 */
export function extractUTMParams(url: string): UTMParams | null {
  try {
    const urlObj = new URL(url);
    const params: UTMParams = {
      utm_source: urlObj.searchParams.get("utm_source") || "",
      utm_medium: urlObj.searchParams.get("utm_medium") || "",
      utm_campaign: urlObj.searchParams.get("utm_campaign") || "",
      utm_term: urlObj.searchParams.get("utm_term") || undefined,
      utm_content: urlObj.searchParams.get("utm_content") || undefined,
    };

    return params;
  } catch {
    return null;
  }
}

/**
 * URL 유효성 검사
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * UTM 파라미터 유효성 검사
 */
export function isValidUTMParams(params: UTMParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!params.utm_source || params.utm_source.trim() === "") {
    errors.push("utm_source is required");
  }
  if (!params.utm_medium || params.utm_medium.trim() === "") {
    errors.push("utm_medium is required");
  }
  if (!params.utm_campaign || params.utm_campaign.trim() === "") {
    errors.push("utm_campaign is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * URL에서 기본 URL 추출 (UTM 파라미터 제외)
 */
export function getBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const utmParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    utmParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * 짧은 날짜 포맷
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
