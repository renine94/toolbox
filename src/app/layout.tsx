import { ReactNode } from "react";

// 루트 레이아웃은 [locale]/layout.tsx에서 html/body를 렌더링하므로
// 여기서는 children만 반환합니다.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
