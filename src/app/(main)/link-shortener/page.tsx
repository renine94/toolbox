import { Metadata } from "next";
import { LinkShortener } from "@/features/tools/link-shortener";

export const metadata: Metadata = {
  title: "Link Shortener | DevTools",
  description:
    "긴 URL을 짧은 링크로 변환하고, QR 코드를 생성하세요. 무료 URL 단축 서비스입니다.",
  keywords: ["URL 단축", "링크 단축", "short URL", "QR 코드", "link shortener"],
};

export default function LinkShortenerPage() {
  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Link Shortener</h1>
        <p className="text-muted-foreground mt-2">
          긴 URL을 짧은 링크로 변환하고, QR 코드를 생성하세요.
        </p>
      </div>
      <LinkShortener />
    </div>
  );
}
