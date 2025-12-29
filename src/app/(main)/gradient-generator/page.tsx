import { GradientGenerator } from "@/features/tools/gradient-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient Generator | DevTools",
  description:
    "CSS 그라디언트를 시각적으로 생성하는 도구. 선형, 방사형, 원뿔형 그라디언트를 만들고 CSS/Tailwind/SCSS 코드로 내보낼 수 있습니다.",
};

export default function GradientGeneratorPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Gradient Generator
        </h1>
        <p className="text-muted-foreground">
          선형, 방사형, 원뿔형 그라디언트를 시각적으로 생성하고, 다양한 형식의
          코드로 내보낼 수 있습니다.
        </p>
      </div>
      <GradientGenerator />
    </div>
  );
}
