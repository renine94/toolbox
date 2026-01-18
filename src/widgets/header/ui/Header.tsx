"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(var(--background), 0.5)", "rgba(var(--background), 0.95)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 0 transparent", "0 4px 20px -4px rgba(0, 0, 0, 0.1)"]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "#tools", label: t("tools") },
    { href: "#categories", label: t("categories") },
    { href: "#about", label: t("about") },
  ];

  return (
    <motion.header
      className="border-b border-border backdrop-blur-xl bg-background/50 supports-backdrop-filter:bg-background/50 sticky top-0 z-50"
      style={{
        boxShadow: headerShadow,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            T
          </motion.div>
          <span className="text-xl font-bold text-foreground">
            {t("brand")}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <LanguageSwitcher />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-full w-9 h-9 border border-transparent hover:bg-accent hover:text-accent-foreground overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && (
                  theme === "dark" ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
              <span className="sr-only">{tCommon("a11y.toggleTheme")}</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
