"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "#tools", label: t("tools") },
    { href: "#categories", label: t("categories") },
    { href: "#about", label: t("about") },
  ];

  return (
    <header className="border-b border-border backdrop-blur-xl bg-background/50 supports-backdrop-filter:bg-background/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
            T
          </div>
          <span className="text-xl font-bold text-foreground">
            {t("brand")}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9 border border-transparent hover:bg-accent hover:text-accent-foreground"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-slate-300" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-600 dark:text-blue-400" />
            <span className="sr-only">{tCommon("a11y.toggleTheme")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
