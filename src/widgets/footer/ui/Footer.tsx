"use client";

import { useTranslations } from "next-intl";

interface FooterProps {
  copyrightYear?: number;
}

export function Footer({ copyrightYear = new Date().getFullYear() }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-lg font-semibold text-foreground">
              {tNav("brand")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {t("copyright", { year: copyrightYear, brand: tNav("brand") })}
          </p>
        </div>
      </div>
    </footer>
  );
}
