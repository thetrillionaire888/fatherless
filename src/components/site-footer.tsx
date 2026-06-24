"use client";

import {
  Heart,
  Mail,
  MapPin,
  Instagram,
  Phone,
  User,
  Landmark,
  Navigation,
} from "lucide-react";
import type { ViewName } from "@/lib/data";
import { CONTACT, BANKWIRE } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { AksaraName } from "@/components/aksara-name";
import { WhatsAppGlyph, buildWhatsAppUrl } from "@/components/whatsapp-button";

export function SiteFooter({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);

  return (
    <footer className="mt-auto border-t border-amber-900/20 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground">
                <Heart className="h-5 w-5" />
              </span>
              <span className="font-blackletter text-2xl">{t("app.name")}</span>
            </div>
            <p className="mt-4 font-im-fell text-base italic text-background/70">
              {t("footer.verseBody")}
              <span className="mt-1 block text-sm not-italic text-background/50">
                — {t("footer.verseRef")}
              </span>
            </p>
            {CONTACT.aksaraJawa && CONTACT.fullName && (
              <div className="mt-4 border-t border-background/15 pt-4">
                <AksaraName
                  aksaraJawa={CONTACT.aksaraJawa}
                  fullName={CONTACT.fullName[lang]}
                  variant="compact"
                  className="items-start text-left"
                />
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-background/60">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-2 text-sm">
              {(
                [
                  ["home", "nav.home"],
                  ["calendar", "nav.calendar"],
                  ["map", "nav.map"],
                  ["gallery", "nav.gallery"],
                  ["donation", "nav.donation"],
                ] as [ViewName, string][]
              ).map(([v, key]) => (
                <li key={v}>
                  <button
                    onClick={() => onNavigate(v)}
                    className="text-background/80 transition-colors hover:text-background"
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-background/60">
              {t("contact.title")}
            </h4>
            <ul className="space-y-2.5 text-sm text-background/80">
              <li className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-background/50">
                    {t("contact.person")}
                  </span>
                  {CONTACT.person[lang]}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-start gap-2 transition-colors hover:text-background"
                >
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                  <span>{CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 transition-colors hover:text-background"
                >
                  <WhatsAppGlyph className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                  <span>
                    {t("contact.whatsapp")}
                    <span className="block text-xs text-background/60">
                      {CONTACT.phoneDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 transition-colors hover:text-background"
                >
                  <Instagram className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                  <span>@{CONTACT.instagram}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapsLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 transition-colors hover:text-background"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                  <span className="text-xs leading-relaxed text-background/70 group-hover:text-background">
                    {CONTACT.fullAddress}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-background/60">
              {t("bankwire.title")}
            </h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <span className="block text-xs uppercase tracking-wider text-background/50">
                  {t("bankwire.bank")}
                </span>
                {BANKWIRE.bank[lang]}
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-background/50">
                  {t("bankwire.swift")}
                </span>
                <span className="font-mono">{BANKWIRE.swift}</span>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-background/50">
                  {t("bankwire.account")}
                </span>
                <span className="font-mono">{BANKWIRE.account}</span>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-background/50">
                  {t("bankwire.careOf")}
                </span>
                {BANKWIRE.careOf[lang]}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-6 text-center text-xs text-background/50 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="font-im-fell italic">{t("footer.verse")}</p>
        </div>
      </div>
    </footer>
  );
}
