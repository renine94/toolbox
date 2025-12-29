import { ColorPalette } from "@/features/tools/color-palette";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette | DevTools",
  description:
    "색상 조화 팔레트 생성 도구. 보색, 유사색, 삼원색 등 다양한 조화 타입과 이미지 색상 추출, CSS/Tailwind 내보내기를 지원합니다.",
};

export default function ColorPalettePage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Color Palette</h1>
        <p className="text-muted-foreground">
          색상 조화 팔레트를 생성하고, 이미지에서 색상을 추출하며, 다양한 형식으로
          내보낼 수 있습니다.
        </p>
      </div>
      <ColorPalette />
    </div>
  );
}
