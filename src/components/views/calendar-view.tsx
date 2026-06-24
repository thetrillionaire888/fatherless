"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  HeartHandshake,
  MapPin,
  Users,
  Mail,
  Bell,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ORPHANAGES, type ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Visit = {
  id: string;
  visitorName: string;
  email: string;
  orphanageId: string;
  visitDate: string;
  partySize: number;
  message: string | null;
};
type Prayer = {
  id: string;
  name: string;
  email: string;
  prayerDate: string;
  prayerTime: string;
  reminderEmail: boolean;
  note: string | null;
};
type DonSched = {
  id: string;
  name: string;
  email: string;
  donationDate: string;
  reminderEmail: boolean;
  note: string | null;
};

export function CalendarView({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  return (
    <div className="min-h-screen">
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
              <CalendarIcon className="h-4 w-4" />
              {t("cal.badge")}
            </div>
            <h1 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
              {t("cal.heading")}
            </h1>
            <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
              {t("cal.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        <Tabs defaultValue="visit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visit" className="gap-1.5">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("cal.tab.visit")}</span>
              <span className="sm:hidden">{t("cal.tab.visitShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="prayer" className="gap-1.5">
              <HeartHandshake className="h-4 w-4" />
              <span className="hidden sm:inline">{t("cal.tab.prayer")}</span>
              <span className="sm:hidden">{t("cal.tab.prayerShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="donation" className="gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">{t("cal.tab.donation")}</span>
              <span className="sm:hidden">{t("cal.tab.donationShort")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visit" className="mt-6">
            <VisitTab />
          </TabsContent>
          <TabsContent value="prayer" className="mt-6">
            <PrayerTab />
          </TabsContent>
          <TabsContent value="donation" className="mt-6">
            <DonationTab onNavigate={onNavigate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---------------- Visits ---------------- */
function VisitTab() {
  const { toast } = useToast();
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orphanageId, setOrphanageId] = useState(ORPHANAGES[0].id);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [party, setParty] = useState("1");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/visits");
    const data = await res.json();
    setVisits(data.visits ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const submit = async () => {
    if (!name || !email || !date) {
      toast({
        title: t("cal.err.required"),
        description: t("cal.err.visitRequired"),
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: name,
          email,
          orphanageId,
          visitDate: date.toISOString().slice(0, 10),
          partySize: Number(party) || 1,
          message,
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: t("cal.visit.successTitle"),
        description: t("cal.visit.successDesc"),
      });
      setName("");
      setEmail("");
      setParty("1");
      setMessage("");
      setDate(undefined);
      load();
    } catch {
      toast({
        title: t("cal.err.generic"),
        description: t("cal.err.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-1 font-garamond text-2xl font-bold">
          {t("cal.visit.heading")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.visit.subtitle")}
        </p>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="v-name">{t("cal.visit.name")}</Label>
            <Input
              id="v-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="v-email">{t("cal.visit.email")}</Label>
            <Input
              id="v-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("cal.visit.orphanage")}</Label>
            <Select value={orphanageId} onValueChange={setOrphanageId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORPHANAGES.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name[lang]} — {o.location[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>{t("cal.visit.date")}</Label>
            <div className="rounded-lg border border-border bg-card p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().toDateString())}
                className="mx-auto"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="v-party">{t("cal.visit.party")}</Label>
            <Input
              id="v-party"
              type="number"
              min={1}
              value={party}
              onChange={(e) => setParty(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="v-msg">{t("cal.visit.message")}</Label>
            <Textarea
              id="v-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("cal.visit.messagePh")}
              rows={2}
            />
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("cal.visit.submitting")}
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4" /> {t("cal.visit.submit")}
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-garamond text-2xl font-bold">
          <Users className="h-5 w-5 text-ember" />
          {t("cal.visit.list")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.visit.listSub")}
        </p>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto custom-scroll pr-1">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : visits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("cal.visit.empty")}
            </p>
          ) : (
            visits.map((v) => {
              const o = ORPHANAGES.find((x) => x.id === v.orphanageId);
              return (
                <div
                  key={v.id}
                  className="rounded-lg border border-border bg-background/50 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {v.visitorName}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {o ? `${o.name[lang]} — ${o.location[lang]}` : v.orphanageId}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-700/10 px-2.5 py-1 text-xs font-medium text-ember">
                      {fmtDate(v.visitDate)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {v.partySize}{" "}
                      {v.partySize > 1 ? t("cal.visit.people") : t("cal.visit.person")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {v.email}
                    </span>
                  </div>
                  {v.message && (
                    <p className="mt-2 font-im-fell text-sm italic text-foreground/70">
                      &ldquo;{v.message}&rdquo;
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Prayer ---------------- */
function PrayerTab() {
  const { toast } = useToast();
  const t = useT();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("19:00");
  const [reminder, setReminder] = useState(true);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/prayers");
    const data = await res.json();
    setPrayers(data.prayers ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const submit = async () => {
    if (!name || !email || !date) {
      toast({
        title: t("cal.err.required"),
        description: t("cal.err.prayerRequired"),
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          prayerDate: date.toISOString().slice(0, 10),
          prayerTime: time,
          reminderEmail: reminder,
          note,
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: t("cal.prayer.successTitle"),
        description: reminder
          ? t("cal.prayer.successDescReminder")
          : t("cal.prayer.successDescNo"),
      });
      setName("");
      setEmail("");
      setNote("");
      setDate(undefined);
      load();
    } catch {
      toast({
        title: t("cal.err.generic"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-1 font-garamond text-2xl font-bold">
          {t("cal.prayer.heading")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.prayer.subtitle")}
        </p>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="p-name">{t("cal.prayer.name")}</Label>
            <Input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sister Grace"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-email">{t("cal.visit.email")}</Label>
            <Input
              id="p-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("cal.prayer.date")}</Label>
            <div className="rounded-lg border border-border bg-card p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().toDateString())}
                className="mx-auto"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-time">{t("cal.prayer.time")}</Label>
            <Input
              id="p-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-ember" />
              <Label htmlFor="p-rem" className="cursor-pointer">
                {t("cal.prayer.reminder")}
              </Label>
            </div>
            <Switch id="p-rem" checked={reminder} onCheckedChange={setReminder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-note">{t("cal.prayer.note")}</Label>
            <Textarea
              id="p-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("cal.prayer.notePh")}
              rows={2}
            />
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("cal.visit.submitting")}
              </>
            ) : (
              <>
                <HeartHandshake className="h-4 w-4" /> {t("cal.prayer.submit")}
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-garamond text-2xl font-bold">
          <HeartHandshake className="h-5 w-5 text-ember" />
          {t("cal.prayer.list")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.prayer.listSub")}
        </p>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto custom-scroll pr-1">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : prayers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("cal.prayer.empty")}
            </p>
          ) : (
            prayers.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-border bg-background/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <span className="rounded-full bg-amber-700/10 px-2.5 py-1 text-xs font-medium text-ember">
                    {fmtDate(p.prayerDate)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {p.prayerTime || "—"}
                  </span>
                  {p.reminderEmail && (
                    <span className="flex items-center gap-1 text-ember">
                      <Bell className="h-3.5 w-3.5" /> {t("cal.prayer.reminderSet")}
                    </span>
                  )}
                </div>
                {p.note && (
                  <p className="mt-2 font-im-fell text-sm italic text-foreground/70">
                    &ldquo;{p.note}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Donation schedule ---------------- */
function DonationTab({ onNavigate }: { onNavigate: (v: ViewName) => void }) {
  const { toast } = useToast();
  const t = useT();
  const [schedules, setSchedules] = useState<DonSched[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reminder, setReminder] = useState(true);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/donation-schedules");
    const data = await res.json();
    setSchedules(data.schedules ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const submit = async () => {
    if (!name || !email || !date) {
      toast({
        title: t("cal.err.required"),
        description: t("cal.err.donationRequired"),
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/donation-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          donationDate: date.toISOString().slice(0, 10),
          reminderEmail: reminder,
          note,
        }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: t("cal.don.successTitle"),
        description: reminder
          ? t("cal.don.successDescReminder")
          : t("cal.don.successDescNo"),
      });
      setName("");
      setEmail("");
      setNote("");
      setDate(undefined);
      load();
    } catch {
      toast({ title: t("cal.err.generic"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-1 font-garamond text-2xl font-bold">
          {t("cal.don.heading")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.don.subtitle")}{" "}
          <button
            onClick={() => onNavigate("donation")}
            className="font-semibold text-ember underline"
          >
            {t("cal.don.visitLink")}
          </button>
          .
        </p>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="d-name">{t("cal.don.name")}</Label>
            <Input
              id="d-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="d-email">{t("cal.don.email")}</Label>
            <Input
              id="d-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("cal.don.date")}</Label>
            <div className="rounded-lg border border-border bg-card p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().toDateString())}
                className="mx-auto"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-ember" />
              <Label htmlFor="d-rem" className="cursor-pointer">
                {t("cal.don.reminder")}
              </Label>
            </div>
            <Switch id="d-rem" checked={reminder} onCheckedChange={setReminder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="d-note">{t("cal.don.note")}</Label>
            <Textarea
              id="d-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("cal.don.notePh")}
              rows={2}
            />
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("cal.visit.submitting")}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> {t("cal.don.submit")}
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-garamond text-2xl font-bold">
          <Clock className="h-5 w-5 text-ember" />
          {t("cal.don.list")}
        </h3>
        <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
          {t("cal.don.listSub")}
        </p>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto custom-scroll pr-1">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("cal.don.empty")}</p>
          ) : (
            schedules.map((s) => (
              <div
                key={s.id}
                className={cn("rounded-lg border border-border bg-background/50 p-4")}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <span className="rounded-full bg-amber-700/10 px-2.5 py-1 text-xs font-medium text-ember">
                    {fmtDate(s.donationDate)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {s.email}
                  </span>
                  {s.reminderEmail && (
                    <span className="flex items-center gap-1 text-ember">
                      <Bell className="h-3.5 w-3.5" /> {t("cal.prayer.reminderSet")}
                    </span>
                  )}
                </div>
                {s.note && (
                  <p className="mt-2 font-im-fell text-sm italic text-foreground/70">
                    &ldquo;{s.note}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function fmtDate(s: string) {
  try {
    const d = new Date(s + (s.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return s;
  }
}
