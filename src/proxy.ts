import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // 다음 경로들은 미들웨어에서 제외:
  // - api: API 라우트
  // - _next: Next.js 내부 파일
  // - _vercel: Vercel 내부 파일
  // - admin: Admin 페이지 (한국어 고정)
  // - .*\\..* : 정적 파일 (이미지, CSS, JS 등)
  matcher: ["/((?!api|_next|_vercel|admin|.*\\..*).*)", "/"],
};
