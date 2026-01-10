import { Metadata } from "next";
import { LoremIpsum } from "@/features/tools/lorem-ipsum";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator | Toolbox",
  description:
    "더미 텍스트를 다양한 형식으로 생성합니다. 문단, 문장, 단어 수를 선택하고 Lorem Ipsum 텍스트를 생성하세요.",
};

export default function LoremIpsumPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground mt-2">
          더미 텍스트를 다양한 형식으로 생성합니다. 문단, 문장, 단어 수를
          선택하고 Lorem Ipsum 텍스트를 생성하세요.
        </p>
      </div>
      <LoremIpsum />
    </div>
  );
}
