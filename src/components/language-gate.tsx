"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Rehydrates the persisted language preference AFTER mount to avoid
 * SSR/CSR hydration mismatches, and keeps <html lang> in sync.
 */
export function LanguageGate({ children }: { children: React.ReactNode }) {
  const lang = useLanguage((s) => s.lang);
  const setLang = useLanguage((s) => s.setLang);

  useEffect(() => {
    // Manually rehydrate from localStorage on the client (runs once on mount).
    try {
      const raw = localStorage.getItem("rbh-lang");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { lang?: string } };
        const stored = parsed?.state?.lang;
        if ((stored === "en" || stored === "id") && stored !== lang) {
          setLang(stored);
        }
      }
    } catch {
      /* ignore */
    }
    // Intentionally run only on mount; re-reading on every lang change would loop.
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <>{children}</>;
}
