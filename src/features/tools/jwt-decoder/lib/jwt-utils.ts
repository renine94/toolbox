import type { DecodedJwt, JwtHeader, JwtPayload, JwtValidation } from "../model/types";

/**
 * Base64URL을 일반 Base64로 변환
 */
function base64UrlToBase64(str: string): string {
  let result = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = result.length % 4;
  if (padding) {
    result += "=".repeat(4 - padding);
  }
  return result;
}

/**
 * Base64URL 문자열을 디코딩
 */
export function base64UrlDecode(str: string): string {
  try {
    const base64 = base64UrlToBase64(str);
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    throw new Error("Base64URL 디코딩 실패");
  }
}

/**
 * JWT 형식 유효성 검사
 */
export function isValidJwtFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => part.length > 0 && base64UrlRegex.test(part));
}

/**
 * Unix 타임스탬프를 Date 객체로 변환
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * 토큰 만료 여부 확인
 */
export function isTokenExpired(exp: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

/**
 * JWT 토큰 디코드
 */
export function decodeJwt(token: string): DecodedJwt | null {
  if (!isValidJwtFormat(token)) {
    return null;
  }

  try {
    const [headerPart, payloadPart, signaturePart] = token.split(".");

    const headerJson = base64UrlDecode(headerPart);
    const payloadJson = base64UrlDecode(payloadPart);

    const header: JwtHeader = JSON.parse(headerJson);
    const payload: JwtPayload = JSON.parse(payloadJson);

    const isExpired = payload.exp ? isTokenExpired(payload.exp) : false;
    const expiresAt = payload.exp ? timestampToDate(payload.exp) : undefined;
    const issuedAt = payload.iat ? timestampToDate(payload.iat) : undefined;

    return {
      header,
      payload,
      signature: signaturePart,
      isExpired,
      expiresAt,
      issuedAt,
    };
  } catch {
    return null;
  }
}

/**
 * JWT 유효성 검증
 */
export function validateJwt(token: string): JwtValidation {
  const errors: string[] = [];

  if (!token || token.trim() === "") {
    return {
      isValid: false,
      isExpired: false,
      errors: ["토큰이 비어있습니다"],
    };
  }

  if (!isValidJwtFormat(token)) {
    return {
      isValid: false,
      isExpired: false,
      errors: ["올바른 JWT 형식이 아닙니다 (header.payload.signature)"],
    };
  }

  const decoded = decodeJwt(token);
  if (!decoded) {
    return {
      isValid: false,
      isExpired: false,
      errors: ["JWT 디코딩에 실패했습니다"],
    };
  }

  if (!decoded.header.alg) {
    errors.push("헤더에 알고리즘(alg)이 없습니다");
  }

  if (!decoded.header.typ) {
    errors.push("헤더에 타입(typ)이 없습니다");
  }

  const isExpired = decoded.isExpired;
  if (isExpired) {
    errors.push("토큰이 만료되었습니다");
  }

  if (decoded.payload.nbf) {
    const now = Math.floor(Date.now() / 1000);
    if (decoded.payload.nbf > now) {
      errors.push("토큰이 아직 활성화되지 않았습니다 (nbf)");
    }
  }

  return {
    isValid: errors.length === 0,
    isExpired,
    errors,
  };
}

/**
 * JSON을 보기 좋게 포맷팅
 */
export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

/**
 * 클립보드에 복사
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * 상대적 시간 표시 (예: "3시간 전", "2일 후")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const isFuture = diffMs > 0;
  const suffix = isFuture ? "후" : "전";

  const absDiffMin = Math.abs(diffMin);
  const absDiffHour = Math.abs(diffHour);
  const absDiffDay = Math.abs(diffDay);

  if (absDiffDay > 0) {
    return `${absDiffDay}일 ${suffix}`;
  }
  if (absDiffHour > 0) {
    return `${absDiffHour}시간 ${suffix}`;
  }
  if (absDiffMin > 0) {
    return `${absDiffMin}분 ${suffix}`;
  }
  return isFuture ? "곧" : "방금";
}

/**
 * 날짜를 로컬 형식으로 포맷
 */
export function formatDate(date: Date): string {
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
