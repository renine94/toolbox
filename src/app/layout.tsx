import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers/query-provider";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "@/shared/ui/sonner";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolBox - 온라인 도구 모음",
  description: "개발자, 디자이너, 마케터를 위한 유용한 온라인 도구들을 한 곳에서 만나보세요. JSON Formatter, Color Picker, QR 코드 생성기 등 다양한 도구를 무료로 제공합니다.",
  keywords: ["도구", "개발자", "디자이너", "JSON", "Color Picker", "온라인 도구", "base64", "color picker", "qr code", "code runner", "regex tester", "color palette", "image editor", "gradient generator", "qr code generator", "link shortener", "markdown editor", "word counter", "lorem ipsum generator", "unit converter", "timezone converter", "password generator"],
  authors: [{ name: "ToolBox" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
