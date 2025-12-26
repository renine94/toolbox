"use client";

import { Language } from "../model/types";
import { useCodeStore } from "../model/useCodeStore";

const languages: { value: Language; label: string; icon: string }[] = [
  { value: "javascript", label: "JavaScript", icon: "JS" },
  { value: "python", label: "Python", icon: "PY" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useCodeStore();

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.value}
          onClick={() => setLanguage(lang.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            language === lang.value
              ? lang.value === "javascript"
                ? "bg-yellow-500 text-black"
                : "bg-blue-600 text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              language === lang.value
                ? "bg-black/20"
                : lang.value === "javascript"
                  ? "bg-yellow-500/20 text-yellow-600"
                  : "bg-blue-500/20 text-blue-600"
            }`}
          >
            {lang.icon}
          </span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}
