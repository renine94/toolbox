import type { MetaTags } from "../model/types";
import { CHARACTER_LIMITS, Platform } from "../model/types";

/**
 * 글자 수 제한을 체크하고 상태를 반환
 */
export function checkCharacterLimit(
  text: string,
  platform: Platform,
  field: "title" | "description"
): {
  count: number;
  limit: number;
  isOver: boolean;
  percentage: number;
} {
  const limit = CHARACTER_LIMITS[platform][field];
  const count = text.length;
  const isOver = count > limit;
  const percentage = Math.min((count / limit) * 100, 100);

  return { count, limit, isOver, percentage };
}

/**
 * 플랫폼별로 표시될 제목 결정
 * og:title > title 순서로 fallback
 */
export function getDisplayTitle(metaTags: MetaTags): string {
  return metaTags.ogTitle || metaTags.title || "";
}

/**
 * 플랫폼별로 표시될 설명 결정
 * og:description > description 순서로 fallback
 */
export function getDisplayDescription(metaTags: MetaTags): string {
  return metaTags.ogDescription || metaTags.description || "";
}

/**
 * Twitter용 제목 결정
 * twitter:title > og:title > title 순서로 fallback
 */
export function getTwitterTitle(metaTags: MetaTags): string {
  return metaTags.twitterTitle || metaTags.ogTitle || metaTags.title || "";
}

/**
 * Twitter용 설명 결정
 * twitter:description > og:description > description 순서로 fallback
 */
export function getTwitterDescription(metaTags: MetaTags): string {
  return metaTags.twitterDescription || metaTags.ogDescription || metaTags.description || "";
}

/**
 * Twitter용 이미지 결정
 * twitter:image > og:image 순서로 fallback
 */
export function getTwitterImage(metaTags: MetaTags): string {
  return metaTags.twitterImage || metaTags.ogImage || "";
}

/**
 * URL에서 도메인 추출
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

/**
 * URL이 유효한지 확인
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
 * 텍스트 자르기 (말줄임표 추가)
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * MetaTags를 HTML 메타 태그 코드로 변환
 */
export function generateMetaTagsHtml(metaTags: MetaTags): string {
  const tags: string[] = [];

  // 기본 메타 태그
  if (metaTags.title) {
    tags.push(`<title>${escapeHtml(metaTags.title)}</title>`);
  }

  if (metaTags.description) {
    tags.push(`<meta name="description" content="${escapeHtml(metaTags.description)}" />`);
  }

  // Open Graph 메타 태그
  if (metaTags.ogTitle) {
    tags.push(`<meta property="og:title" content="${escapeHtml(metaTags.ogTitle)}" />`);
  }

  if (metaTags.ogDescription) {
    tags.push(`<meta property="og:description" content="${escapeHtml(metaTags.ogDescription)}" />`);
  }

  if (metaTags.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(metaTags.ogImage)}" />`);
  }

  if (metaTags.ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(metaTags.ogUrl)}" />`);
  }

  if (metaTags.ogType) {
    tags.push(`<meta property="og:type" content="${escapeHtml(metaTags.ogType)}" />`);
  }

  if (metaTags.siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(metaTags.siteName)}" />`);
  }

  // Twitter 메타 태그
  if (metaTags.twitterCard) {
    tags.push(`<meta name="twitter:card" content="${escapeHtml(metaTags.twitterCard)}" />`);
  }

  if (metaTags.twitterTitle) {
    tags.push(`<meta name="twitter:title" content="${escapeHtml(metaTags.twitterTitle)}" />`);
  }

  if (metaTags.twitterDescription) {
    tags.push(`<meta name="twitter:description" content="${escapeHtml(metaTags.twitterDescription)}" />`);
  }

  if (metaTags.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(metaTags.twitterImage)}" />`);
  }

  return tags.join("\n");
}

/**
 * HTML 특수 문자 이스케이프
 */
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
}
