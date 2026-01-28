import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { QuickAccessButton, ToolUsageTracker } from "@/widgets/quick-access";
import { CommandPalette } from "@/widgets/command-palette";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolbox-six-sigma.vercel.app';

// 레이아웃에서는 metadataBase만 설정
// canonical, alternates, openGraph는 각 페이지에서 개별 설정
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  authors: [{ name: "ToolBox" }],
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
      <QuickAccessButton />
      <ToolUsageTracker />
      <CommandPalette />
    </div>
  );
}