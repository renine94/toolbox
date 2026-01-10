import { Metadata } from "next";
import { UuidGenerator } from "@/features/tools/uuid-generator";

export const metadata: Metadata = {
  title: "UUID Generator | Toolbox",
  description:
    "고유한 UUID(Universally Unique Identifier)를 생성합니다. v1, v4, v7 버전을 지원하며 벌크 생성도 가능합니다.",
};

export default function UuidGeneratorPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">UUID Generator</h1>
        <p className="text-muted-foreground mt-2">
          고유한 UUID를 생성합니다. v1(타임스탬프), v4(랜덤), v7(정렬 가능) 버전을
          지원하며 다양한 포맷 옵션을 제공합니다.
        </p>
      </div>
      <UuidGenerator />
    </div>
  );
}
