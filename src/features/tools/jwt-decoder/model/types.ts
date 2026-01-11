// JWT 헤더 타입
export interface JwtHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: unknown;
}

// JWT 페이로드 표준 클레임
export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

// 디코드 결과
export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
  isExpired: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

// 검증 결과
export interface JwtValidation {
  isValid: boolean;
  isExpired: boolean;
  errors: string[];
}

// 표준 클레임 정보
export const STANDARD_CLAIMS: Record<string, { name: string; description: string }> = {
  iss: { name: "Issuer", description: "토큰 발급자" },
  sub: { name: "Subject", description: "토큰 주체 (사용자 ID 등)" },
  aud: { name: "Audience", description: "토큰 대상자" },
  exp: { name: "Expiration Time", description: "토큰 만료 시간" },
  nbf: { name: "Not Before", description: "토큰 활성화 시간" },
  iat: { name: "Issued At", description: "토큰 발급 시간" },
  jti: { name: "JWT ID", description: "토큰 고유 식별자" },
};

// 알고리즘 정보
export const ALGORITHMS: Record<string, { name: string; description: string }> = {
  HS256: { name: "HMAC SHA-256", description: "대칭키 알고리즘" },
  HS384: { name: "HMAC SHA-384", description: "대칭키 알고리즘" },
  HS512: { name: "HMAC SHA-512", description: "대칭키 알고리즘" },
  RS256: { name: "RSA SHA-256", description: "비대칭키 알고리즘" },
  RS384: { name: "RSA SHA-384", description: "비대칭키 알고리즘" },
  RS512: { name: "RSA SHA-512", description: "비대칭키 알고리즘" },
  ES256: { name: "ECDSA P-256", description: "타원곡선 알고리즘" },
  ES384: { name: "ECDSA P-384", description: "타원곡선 알고리즘" },
  ES512: { name: "ECDSA P-512", description: "타원곡선 알고리즘" },
  PS256: { name: "RSA-PSS SHA-256", description: "RSA-PSS 알고리즘" },
  PS384: { name: "RSA-PSS SHA-384", description: "RSA-PSS 알고리즘" },
  PS512: { name: "RSA-PSS SHA-512", description: "RSA-PSS 알고리즘" },
};

// 예제 JWT 토큰
export const EXAMPLE_TOKENS = {
  valid: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  expired: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyLCJpYXQiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ",
};
