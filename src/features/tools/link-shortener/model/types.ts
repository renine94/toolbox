import { z } from "zod";

// URL 유효성 검증 스키마
export const urlSchema = z
  .string()
  .min(1, "URL을 입력하세요")
  .url("유효한 URL 형식이 아닙니다")
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "http:// 또는 https://로 시작해야 합니다"
  );

// API 제공자
export type ShortenerProvider = "is.gd" | "v.gd";

// 단축 URL 결과
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  provider: ShortenerProvider;
}

// API 응답 타입
export interface ShortenerApiResponse {
  shorturl?: string;
  errorcode?: number;
  errormessage?: string;
}

// 상태 타입
export type ShortenStatus = "idle" | "loading" | "success" | "error";

// API 엔드포인트
export const API_ENDPOINTS: Record<ShortenerProvider, string> = {
  "is.gd": "https://is.gd/create.php",
  "v.gd": "https://v.gd/create.php",
};

// 기본 설정
export const DEFAULT_PROVIDER: ShortenerProvider = "is.gd";

// 로컬 스토리지 키
export const STORAGE_KEY = "link-shortener-history";

// 최대 이력 저장 개수
export const MAX_HISTORY_COUNT = 50;

// 제공자 옵션
export const PROVIDER_OPTIONS: { value: ShortenerProvider; label: string }[] = [
  { value: "is.gd", label: "is.gd" },
  { value: "v.gd", label: "v.gd" },
];
