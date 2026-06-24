"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  CreditCard,
  Wallet,
  Landmark,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Users,
  Lock,
  Copy,
  Check,
  Instagram,
  Phone,
  User,
  QrCode,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  PAYMENT_METHODS,
  maskName,
  maskAmount,
  formatAmount,
  CURRENCIES,
  CURRENCY_META,
  type Currency,
  CONTACT,
  BANKWIRE,
} from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { WhatsAppGlyph, buildWhatsAppUrl } from "@/components/whatsapp-button";

type Donor = {
  id: string;
  displayName: string;
  amount: number;
  currency: string;
  anonymousName: boolean;
  anonymousAmount: boolean;
  paymentMethod: string;
  message: string | null;
  createdAt: string;
};

const PAYMENT_ICONS: Record<string, typeof CreditCard> = {
  PayPal: Wallet,
  Stripe: CreditCard,
  Gopay: Wallet,
  "Shopee Pay": Wallet,
  QRIS: QrCode,
  VISA: CreditCard,
  Mastercard: CreditCard,
  "Bankwire transfer": Landmark,
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DonationView() {
  const { toast } = useToast();
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<{
    authenticated: boolean;
    role?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {
        if (!cancelled) setSession({ authenticated: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [anonName, setAnonName] = useState(false);
  const [anonAmount, setAnonAmount] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/donors");
    const data = await res.json();
    setDonors(data.donors ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  // Per-currency sums (no conversion). disclosed vs undisclosed per currency.
  const sums = useMemo(() => {
    const byCur: Record<
      Currency,
      { disclosed: number; undisclosed: number; count: number }
    > = {
      USD: { disclosed: 0, undisclosed: 0, count: 0 },
      IDR: { disclosed: 0, undisclosed: 0, count: 0 },
    };
    for (const d of donors) {
      const cur = (d.currency === "IDR" ? "IDR" : "USD") as Currency;
      if (d.anonymousAmount) byCur[cur].undisclosed += d.amount;
      else byCur[cur].disclosed += d.amount;
      byCur[cur].count += 1;
    }
    return byCur;
  }, [donors]);

  const donorCount = donors.length;

  const submit = async () => {
    const amt = parseFloat(amount);
    if (!name.trim() || !amt || amt <= 0 || !method || !message.trim()) {
      toast({
        title: t("don.err.complete"),
        description: !message.trim()
          ? t("don.err.messageRequired")
          : t("don.err.required"),
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name.trim(),
          amount: amt,
          currency,
          anonymousName: anonName,
          anonymousAmount: anonAmount,
          paymentMethod: method,
          message,
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: t("don.successTitle"),
        description: t("don.successDesc").replace(
          "{method}",
          `${formatAmount(amt, currency)} ${method}`
        ),
      });
      setName("");
      setAmount("");
      setMessage("");
      setAnonName(false);
      setAnonAmount(false);
      load();
    } catch {
      toast({ title: t("cal.err.generic"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const previewName = anonName ? maskName(name || "Your Name") : name || "Your Name";
  const previewAmount = anonAmount
    ? maskAmount()
    : amount
      ? formatAmount(parseFloat(amount) || 0, currency)
      : formatAmount(0, currency);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="parchment-bg relative">
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-3 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900">
              <Heart className="h-4 w-4" />
              {t("don.badge")}
            </div>
            <h1 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
              {t("don.heading")}
            </h1>
            <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
              {t("don.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        {/* Patreon session banner */}
        {session && session.authenticated && (
          <div className="mb-8 flex flex-col gap-2 rounded-lg border border-emerald-700/30 bg-emerald-100/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-garamond text-base font-semibold text-emerald-900">
                {t("don.patreonWelcome")} {session.email}
              </div>
              <div className="font-im-fell text-sm italic text-emerald-800/80">
                {t("don.patreonThanks")}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/login">{t("don.patreonDashBack")}</a>
            </Button>
          </div>
        )}
        {session && !session.authenticated && (
          <div className="mb-8 flex flex-col gap-3 rounded-lg border border-amber-800/30 bg-amber-100/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-garamond text-base font-semibold text-amber-900">
                {t("don.patreonSignInPrompt")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href="/login?redirect=%2F">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("don.patreonSignIn")}
                </a>
              </Button>
              <Button asChild size="sm">
                <a href="/login?redirect=%2F&mode=signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("don.patreonSignUp")}
                </a>
              </Button>
            </div>
          </div>
        )}
        {/* Summary stats — per currency (no conversion) */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* USD block */}
          <CurrencyStatsCard
            currency="USD"
            disclosed={sums.USD.disclosed}
            undisclosed={sums.USD.undisclosed}
            count={sums.USD.count}
            t={t}
          />
          {/* IDR block */}
          <CurrencyStatsCard
            currency="IDR"
            disclosed={sums.IDR.disclosed}
            undisclosed={sums.IDR.undisclosed}
            count={sums.IDR.count}
            t={t}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label={t("don.stats.donors")}
            value={String(donorCount)}
            hint={t("don.stats.donorsHint")}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Donation form */}
          <Card className="p-6 sm:p-7">
            <h2 className="mb-1 font-garamond text-2xl font-bold">
              {t("don.formHeading")}
            </h2>
            <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
              {t("don.formSub")}
            </p>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dname">{t("don.name")}</Label>
                <Input
                  id="dname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anonymous Giver"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="damount">{t("don.amount")}</Label>
                  <span className="text-xs text-muted-foreground">
                    {t("don.currencyHint")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {CURRENCY_META[currency].symbol}
                    </span>
                    <Input
                      id="damount"
                      type="number"
                      min={1}
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={currency === "IDR" ? "50000" : "50"}
                      className="pl-12"
                    />
                  </div>
                  <Select
                    value={currency}
                    onValueChange={(v) => setCurrency(v as Currency)}
                  >
                    <SelectTrigger className="w-[130px] flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CURRENCY_META[c].label[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>{t("don.payment")}</Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = PAYMENT_ICONS[m] ?? CreditCard;
                    const selected = method === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        aria-pressed={selected}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-center transition-all",
                          selected
                            ? "border-amber-700/50 bg-amber-700/15 text-ember ring-1 ring-amber-700/30"
                            : "border-border bg-background/50 text-foreground/70 hover:border-amber-700/30 hover:bg-amber-50/40"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            selected ? "text-ember" : "text-foreground/60"
                          )}
                        />
                        <span className="text-[0.7rem] font-medium leading-tight">
                          {m}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  {t(`don.payment.note.${method}`)}
                </p>
                {method === "QRIS" && <QrisBlock t={t} />}
                {method === "Bankwire transfer" && (
                  <InlineBankwireDetails lang={lang} t={t} toast={toast} />
                )}
              </div>

              {/* Privacy toggles */}
              <div className="space-y-2.5 rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label
                      htmlFor="anon-name"
                      className="flex cursor-pointer items-center gap-1.5"
                    >
                      <EyeOff className="h-4 w-4 text-ember" />
                      {t("don.maskName")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("don.showAs")}{" "}
                      <span className="font-mono">{maskName("Anonymous Giver")}</span>
                    </p>
                  </div>
                  <Switch
                    id="anon-name"
                    checked={anonName}
                    onCheckedChange={setAnonName}
                  />
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label
                      htmlFor="anon-amt"
                      className="flex cursor-pointer items-center gap-1.5"
                    >
                      <EyeOff className="h-4 w-4 text-ember" />
                      {t("don.maskAmount")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("don.showAs")} <span className="font-mono">{maskAmount()}</span>
                    </p>
                  </div>
                  <Switch
                    id="anon-amt"
                    checked={anonAmount}
                    onCheckedChange={setAnonAmount}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dmessage">
                  {t("don.message")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="dmessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("don.messagePh")}
                  rows={2}
                  required
                />
              </div>

              {/* Live preview */}
              <div className="rounded-lg border border-dashed border-amber-700/40 bg-amber-50/40 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                  {t("don.preview")}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-garamond font-bold text-foreground">
                    {previewName}
                  </span>
                  <span
                    className={cn(
                      "font-garamond text-lg font-bold",
                      anonAmount ? "font-mono text-ember" : "text-ember"
                    )}
                  >
                    {previewAmount}
                  </span>
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={submitting}
                size="lg"
                className="w-full gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("don.processing")}
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" /> {t("don.giveNow")}
                  </>
                )}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("don.secure")}
              </p>
            </div>
          </Card>

          {/* Right column: contact + donor list */}
          <div className="space-y-6">
            <ContactCard lang={lang} t={t} />

            <Card className="flex flex-col p-6 sm:p-7">
              <h2 className="mb-1 flex items-center gap-2 font-garamond text-2xl font-bold">
                <Users className="h-5 w-5 text-ember" />
                {t("don.list.heading")}
              </h2>
              <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
                {t("don.list.sub")}
              </p>

              <div className="max-h-[28rem] flex-1 space-y-3 overflow-y-auto custom-scroll pr-1">
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                  </div>
                ) : donors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("don.list.empty")}
                  </p>
                ) : (
                  donors.map((d) => {
                    const Icon = PAYMENT_ICONS[d.paymentMethod] ?? CreditCard;
                    const shownName = d.anonymousName
                      ? maskName(d.displayName)
                      : d.displayName;
                    const dCur = (d.currency === "IDR" ? "IDR" : "USD") as Currency;
                    const shownAmount = d.anonymousAmount
                      ? maskAmount()
                      : formatAmount(d.amount, dCur);
                    return (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-lg border border-border bg-background/50 p-3.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className={cn(
                                "flex items-center gap-1.5 font-garamond font-bold text-foreground",
                                d.anonymousName && "font-mono"
                              )}
                            >
                              {d.anonymousName && (
                                <EyeOff className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                              )}
                              <span className="truncate">{shownName}</span>
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Icon className="h-3.5 w-3.5" />
                              {d.paymentMethod}
                              <span>·</span>
                              {dCur}
                              <span>·</span>
                              {timeAgo(d.createdAt)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "flex-shrink-0 font-garamond text-lg font-bold text-ember",
                              d.anonymousAmount && "font-mono"
                            )}
                          >
                            {shownAmount}
                          </span>
                        </div>
                        {d.message && (
                          <p className="mt-2 font-im-fell text-sm italic text-foreground/70">
                            &ldquo;{d.message}&rdquo;
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 space-y-3 border-t border-border pt-4">
                {CURRENCIES.filter((c) => sums[c].count > 0).map((c) => (
                  <div key={c} className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {t("don.list.disclosedSum")} · {c}
                      </p>
                      <p className="font-garamond text-lg font-bold text-foreground">
                        {formatAmount(sums[c].disclosed, c)}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                        <EyeOff className="h-3 w-3" /> {t("don.list.undisclosedSum")} · {c}
                      </p>
                      <p className="font-garamond text-lg font-bold text-ember">
                        {formatAmount(sums[c].undisclosed, c)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

type TFunc = (k: string) => string;

function QrisBlock({ t }: { t: TFunc }) {
  return (
    <div className="mt-1 rounded-lg border border-amber-700/40 bg-amber-50/40 p-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-md border border-amber-800/30 bg-white p-2 sm:h-32 sm:w-32">
          <img
            src="/images/qris-code.jpg"
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-garamond text-sm font-bold text-ember">
            {t("don.payment.qrisTitle")}
          </p>
          <p className="mt-1 font-im-fell text-xs italic leading-relaxed text-foreground/70">
            {t("don.payment.qrisScan")}
          </p>
          <p className="mt-2 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            NMID: ID1022148316444
          </p>
        </div>
      </div>
    </div>
  );
}

function InlineBankwireDetails({
  lang,
  t,
  toast,
}: {
  lang: "en" | "id";
  t: TFunc;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, value: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).then(
        () => {
          setCopied(key);
          setTimeout(() => setCopied(null), 1500);
        },
        () => {}
      );
    }
  };

  const rows = [
    { key: "bank", label: t("bankwire.bank"), value: BANKWIRE.bank[lang] },
    { key: "swift", label: t("bankwire.swift"), value: BANKWIRE.swift, mono: true },
    {
      key: "account",
      label: t("bankwire.account"),
      value: BANKWIRE.account,
      mono: true,
    },
    { key: "careOf", label: t("bankwire.careOf"), value: BANKWIRE.careOf[lang] },
  ];

  return (
    <div className="mt-1 rounded-lg border border-amber-700/40 bg-amber-50/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Landmark className="h-4 w-4 text-ember" />
        <p className="font-garamond text-sm font-bold text-ember">
          {t("bankwire.title")}
        </p>
      </div>
      <dl className="divide-y divide-amber-900/15 overflow-hidden rounded-md border border-amber-900/15">
        {rows.map((r) => (
          <div
            key={r.key}
            className="flex items-center justify-between gap-3 bg-background/60 px-3 py-2"
          >
            <dt className="text-xs font-medium text-muted-foreground">
              {r.label}
            </dt>
            <dd className="flex items-center gap-2 text-right">
              <span
                className={cn(
                  "text-sm font-semibold text-foreground",
                  r.mono && "font-mono"
                )}
              >
                {r.value}
              </span>
              <button
                onClick={() => copy(r.key, r.value)}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={t("bankwire.copy")}
                title={t("bankwire.copy")}
              >
                {copied === r.key ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 font-im-fell text-[0.75rem] italic leading-relaxed text-foreground/60">
        {t("bankwire.note")}
      </p>
    </div>
  );
}

function ContactCard({ lang, t }: { lang: "en" | "id"; t: TFunc }) {
  return (
    <Card className="p-6 sm:p-7">
      <h2 className="mb-4 font-garamond text-xl font-bold">{t("contact.title")}</h2>
      <div className="space-y-3">
        <ContactRow
          icon={<User className="h-4 w-4" />}
          label={t("contact.person")}
          value={CONTACT.person[lang]}
        />
        <ContactRow
          icon={<Phone className="h-4 w-4" />}
          label={t("contact.phone")}
          value={CONTACT.phoneDisplay}
          href={`tel:${CONTACT.phone}`}
        />
        <ContactRow
          icon={<WhatsAppGlyph className="h-4 w-4" />}
          label={t("contact.whatsapp")}
          value={CONTACT.phoneDisplay}
          href={buildWhatsAppUrl(lang)}
          external
        />
        <ContactRow
          icon={<Instagram className="h-4 w-4" />}
          label={t("contact.instagram")}
          value={`@${CONTACT.instagram}`}
          href={CONTACT.instagramUrl}
          external
        />
      </div>
    </Card>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-700/10 text-ember">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block font-semibold text-foreground">{value}</span>
      </span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 transition-colors hover:border-amber-700/40 hover:bg-amber-50/40"
      >
        {content}
      </a>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3">
      {content}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-lg border p-5",
        highlight
          ? "border-amber-700/40 bg-amber-700/10"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={highlight ? "text-ember" : ""}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 font-garamond text-3xl font-bold",
          highlight ? "text-ember" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </motion.div>
  );
}

function CurrencyStatsCard({
  currency,
  disclosed,
  undisclosed,
  count,
  t,
}: {
  currency: Currency;
  disclosed: number;
  undisclosed: number;
  count: number;
  t: TFunc;
}) {
  const meta = CURRENCY_META[currency];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-amber-900/20 bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          {meta.label.en} · {currency}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count} {count === 1 ? "donor" : "donors"}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="flex items-center gap-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            <Eye className="h-3 w-3" /> {t("don.list.disclosedSum")}
          </p>
          <p className="mt-0.5 font-garamond text-xl font-bold text-foreground">
            {formatAmount(disclosed, currency)}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            <EyeOff className="h-3 w-3" /> {t("don.list.undisclosedSum")}
          </p>
          <p className="mt-0.5 font-garamond text-xl font-bold text-ember">
            {formatAmount(undisclosed, currency)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
