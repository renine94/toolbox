import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { routing } from "@/i18n/routing";

function getToolSlugs(): string[] {
  // 새로운 경로: src/app/[locale]/(main)
  const mainDir = path.join(process.cwd(), "src/app/[locale]/(main)");

  try {
    const entries = fs.readdirSync(mainDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
      .map((entry) => entry.name);
  } catch {
    // 빌드 시 디렉토리가 없을 수 있음
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://toolbox-six-sigma.vercel.app";
  const tools = getToolSlugs();
  const locales = routing.locales;

  // 각 로케일별 홈 페이지
  const homePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));

  // 각 로케일별 도구 페이지
  const toolPages = locales.flatMap((locale) =>
    tools.map((tool) => ({
      url: `${baseUrl}/${locale}/${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...homePages, ...toolPages];
}
