"use client";

import { Languages } from "lucide-react";
import { useLanguage, LANG_LABEL } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/60 p-0.5 backdrop-blur",
        className
      )}
    >
      <Languages className="ml-2 mr-1 h-3.5 w-3.5 text-muted-foreground" />
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          title={l === "en" ? "English" : "Bahasa Indonesia"}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-foreground/60 hover:text-foreground"
          )}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
