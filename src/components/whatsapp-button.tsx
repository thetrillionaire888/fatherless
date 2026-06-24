"use client";

import { useLanguage, useT } from "@/lib/i18n";
import { CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * WhatsApp icon (official logo path), since lucide-react has no brand icon.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/**
 * Builds a wa.me deep link with a URL-encoded prefilled message.
 * The message language follows the active site language.
 */
export function buildWhatsAppUrl(lang: "en" | "id") {
  const num = CONTACT.whatsappNumber;
  const msg = CONTACT.whatsappMessage[lang];
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

/**
 * A WhatsApp contact button that opens a chat to Mrs Telly Panjaitan with a
 * prefilled message (bilingual).
 */
export function WhatsAppButton({
  variant = "solid",
  className,
  lang,
}: {
  variant?: "solid" | "ghost";
  className?: string;
  lang: "en" | "id";
}) {
  const t = useT();
  const href = buildWhatsAppUrl(lang);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={t("contact.whatsappTip")}
      aria-label={t("contact.whatsappTip")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all hover:scale-[1.03]",
        variant === "solid"
          ? "bg-primary px-5 py-2.5 text-sm text-primary-foreground shadow hover:bg-primary/90"
          : "border border-amber-700/40 bg-amber-50/50 px-4 py-2 text-sm text-amber-900 hover:bg-amber-100/60",
        className
      )}
    >
      <WhatsAppGlyph className="h-5 w-5 flex-shrink-0" />
      {t("contact.whatsapp")}
    </a>
  );
}

export { WhatsAppGlyph };
