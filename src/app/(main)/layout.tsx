import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-ai.vercel.app'

export const metadata: Metadata = {
  title: "ToolBox - 온라인 도구 모음",
  description: "개발자, 디자이너, 마케터를 위한 유용한 온라인 도구들을 한 곳에서 만나보세요. JSON Formatter, Color Picker, QR 코드 생성기 등 다양한 도구를 무료로 제공합니다.",
  keywords: ["toolbox", "도구", "개발자", "디자이너", "JSON", "Color Picker", "온라인 도구", "base64", "color picker", "qr code", "code runner", "regex tester", "color palette", "image editor", "gradient generator", "qr code generator", "link shortener", "markdown editor", "word counter", "lorem ipsum generator", "unit converter", "timezone converter", "password generator"],
  authors: [{ name: "ToolBox" }],
  openGraph: {
    title: "ToolBox - 온라인 도구 모음",
    description: "개발자, 디자이너, 마케터를 위한 유용한 온라인 도구들을 한 곳에서 만나보세요.",
    url: baseUrl,
    siteName: "ToolBox",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox - 온라인 도구 모음",
    description: "개발자, 디자이너, 마케터를 위한 유용한 온라인 도구들을 한 곳에서 만나보세요.",
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <div>
    <Header />
    {children}
    <Footer />
  </div>;
}