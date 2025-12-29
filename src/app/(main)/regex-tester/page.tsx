import { Metadata } from "next";
import { RegexTester } from "@/features/tools/regex-tester";

export const metadata: Metadata = {
  title: "Regex Tester | AI Tools",
  description: "정규표현식을 테스트하고 매칭 결과를 확인합니다. 실시간 하이라이트, 그룹 캡처, 치트시트 제공.",
};

export default function RegexTesterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
          <p className="text-muted-foreground">
            정규표현식을 테스트하고 매칭 결과를 확인합니다. 실시간 하이라이트와 그룹 캡처 결과를 제공합니다.
          </p>
        </div>
        <RegexTester />
      </main>
    </div>
  );
}
