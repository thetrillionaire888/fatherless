"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Loader2,
  LogOut,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  KeyRound,
  Users,
  Database,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/lib/i18n";
import { StoriesManagementCard } from "@/components/admin/stories-management";
import QRCode from "qrcode";

export type Session = {
  authenticated: boolean;
  role?: "admin" | "patron";
  email?: string;
  totpSecret?: string;
  isDefaultAdmin?: boolean;
};

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

export type DashboardShellProps = {
  expectedRole?: "admin" | "patron";
};

export default function DashboardShell({ expectedRole }: DashboardShellProps) {
  const { toast } = useToast();
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await res.json()) as Session;
      setSession(data);
    } catch {
      setSession({ authenticated: false });
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  // Guard: if session resolved and user doesn't match expected role, redirect
  useEffect(() => {
    if (!session || loadingSession) return;
    if (!session.authenticated) {
      router.replace("/login");
      return;
    }
    if (expectedRole && session.role !== expectedRole) {
      // Wrong role — send to correct dashboard
      router.replace(session.role === "admin" ? "/admin" : "/patreon");
      return;
    }
  }, [session, loadingSession, expectedRole, router]);

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!session?.authenticated) return null;

  return (
    <Dashboard
      session={session}
      t={t}
      lang={lang}
      toast={toast}
      onSignOut={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.replace("/");
      }}
    />
  );
}

function Dashboard({
  session,
  t,
  lang,
  toast,
  onSignOut,
}: {
  session: Session;
  t: (k: string) => string;
  lang: "en" | "id";
  toast: ReturnType<typeof useToast>["toast"];
  onSignOut: () => void;
}) {
  const email = session.email || "";

  return (
    <div className="min-h-screen">
      <div className="parchment-bg relative">
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative mx-auto max-w-5xl px-4 py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900">
                <Heart className="h-4 w-4" />
                {session.role === "admin" ? "Admin" : "Patron"}
              </div>
              <h1 className="font-blackletter text-4xl text-ember">
                {session.role === "admin"
                  ? "Rumah Buah Hati — Admin"
                  : t("don.patreonDashWelcome")}
              </h1>
              {session.role === "patron" && (
                <p className="mt-2 max-w-2xl font-im-fell text-base italic text-foreground/70">
                  {t("don.patreonDashBody").replace("{email}", email)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {session.role === "patron" && (
                <Button variant="outline" asChild>
                  <a href="/">{t("don.patreonDashBack")}</a>
                </Button>
              )}
              <Button variant="outline" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("auth.signOutBtn")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <ChangePasswordCard t={t} toast={toast} />

          {session.role === "admin" && (
            <ChangeTotpCard t={t} toast={toast} session={session} />
          )}
          {session.role === "admin" && <StoriesManagementCard />}
          {session.role === "admin" && (
            <DonorManagementCard t={t} toast={toast} lang={lang} />
          )}
          {session.role === "admin" && (
            <BackupRestoreCard t={t} toast={toast} />
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------- ChangePasswordCard -----------------------

function ChangePasswordCard({
  t,
  toast,
}: {
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!current || !next) {
      toast({ title: t("don.err.complete"), variant: "destructive" });
      return;
    }
    if (next !== confirm) {
      toast({ title: t("auth.confirmPassword"), variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: current,
          newPassword: next,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("dash.passwordChanged") });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-1 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-amber-700" />
        <h2 className="font-garamond text-2xl font-bold">
          {t("dash.changePwTitle")}
        </h2>
      </div>
      <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
        {t("dash.changePwDesc")}
      </p>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cpCurrent">{t("dash.currentPassword")}</Label>
          <Input
            id="cpCurrent"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cpNew">{t("dash.newPassword")}</Label>
          <Input
            id="cpNew"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cpConfirm">{t("dash.confirmPassword")}</Label>
          <Input
            id="cpConfirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </div>
        <Button onClick={submit} disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("dash.save")}
        </Button>
      </div>
    </Card>
  );
}

// ----------------------- ChangeTotpCard -----------------------

function ChangeTotpCard({
  t,
  toast,
  session,
}: {
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
  session: Session;
}) {
  const [secret, setSecret] = useState<string>("");
  const [otpauthUri, setOtpauthUri] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingSecret, setLoadingSecret] = useState(false);

  const generate = async () => {
    setLoadingSecret(true);
    try {
      const res = await fetch("/api/admin/totp", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      setSecret(data.secret as string);
      setOtpauthUri(data.otpauthUri as string);
      const url = await QRCode.toDataURL(data.otpauthUri as string, {
        width: 220,
        margin: 1,
      });
      setQrDataUrl(url);
    } catch {
      toast({ title: "Failed to generate secret", variant: "destructive" });
    } finally {
      setLoadingSecret(false);
    }
  };

  const register = async () => {
    if (!secret || !password || !token) {
      toast({ title: t("don.err.complete"), variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: password,
          newSecret: secret,
          token: token.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("dash.totpRegistered") });
      setPassword("");
      setToken("");
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const copySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      toast({ title: "Copied" });
    } catch {
      /* ignore */
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-1 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-amber-700" />
        <h2 className="font-garamond text-2xl font-bold">
          {t("dash.totpTitle")}
        </h2>
      </div>
      <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
        {t("dash.totpDesc")}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={generate} disabled={loadingSecret}>
          {loadingSecret ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {t("dash.totpGenerate")}
        </Button>
      </div>

      {qrDataUrl && (
        <div className="mb-4 grid gap-3 sm:grid-cols-[220px,1fr]">
          <div className="rounded-md border border-amber-800/30 bg-white p-3">
            <img
              src={qrDataUrl}
              alt="TOTP QR code"
              className="h-[220px] w-[220px]"
            />
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label>{t("dash.totpNewSecret")}</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded-md border bg-background/60 p-2 text-xs">
                  {secret}
                </code>
                <Button size="icon" variant="outline" onClick={copySecret}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-1">
              <Label>{t("dash.currentPassword")}</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label>{t("dash.totpToken")}</Label>
              <Input
                inputMode="numeric"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
              />
            </div>
            <Button onClick={register} disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("dash.totpRegister")}
            </Button>
          </div>
        </div>
      )}

      {!qrDataUrl && (
        <div className="rounded-md border border-dashed border-amber-800/20 bg-amber-50/20 p-4 text-sm text-muted-foreground">
          {session.isDefaultAdmin
            ? "Using the default TOTP secret. Generate a new one to register it."
            : "Click above to generate a new secret."}
        </div>
      )}
    </Card>
  );
}

// ----------------------- DonorManagementCard -----------------------

function DonorManagementCard({
  t,
  toast,
  lang,
}: {
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
  lang: "en" | "id";
}) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donors", { cache: "no-store" });
      const data = await res.json();
      setDonors((data.donors ?? []) as Donor[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const deleteOne = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/donors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("dash.donorDeleted") });
      load();
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  const clearAll = async () => {
    try {
      const res = await fetch("/api/admin/donors/clear", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("dash.donorsCleared") });
      load();
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  const fmtAmount = (d: Donor) => {
    try {
      return new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
        style: "currency",
        currency: d.currency || "USD",
      }).format(d.anonymousAmount ? 0 : d.amount);
    } catch {
      return String(d.amount);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-1 flex items-center gap-2">
        <Users className="h-5 w-5 text-amber-700" />
        <h2 className="font-garamond text-2xl font-bold">
          {t("dash.donorsTitle")}
        </h2>
      </div>
      <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
        {t("dash.donorsDesc")}
      </p>

      <div className="mb-4 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("dash.donorsClear")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("dash.donorsClearConfirm")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("dash.donorsClearConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("auth.backToSignIn")}</AlertDialogCancel>
              <AlertDialogAction onClick={clearAll}>
                {t("dash.donorsClear")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
        </div>
      ) : donors.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("dash.donorsEmpty")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">{t("dash.donorName")}</th>
                <th className="py-2 pr-3">{t("dash.donorAmount")}</th>
                <th className="py-2 pr-3">{t("dash.donorMethod")}</th>
                <th className="py-2 pr-3">{t("dash.donorDate")}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">
                    {d.anonymousName ? "••••" : d.displayName}
                  </td>
                  <td className="py-2 pr-3">
                    {d.anonymousAmount ? "••••" : fmtAmount(d)}
                  </td>
                  <td className="py-2 pr-3">{d.paymentMethod}</td>
                  <td className="py-2 pr-3">
                    {new Date(d.createdAt).toLocaleDateString(
                      lang === "id" ? "id-ID" : "en-US"
                    )}
                  </td>
                  <td className="py-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("dash.donorsDeleteConfirm")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {d.anonymousName ? "••••" : d.displayName} —{" "}
                            {d.anonymousAmount ? "••••" : fmtAmount(d)}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("auth.backToSignIn")}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteOne(d.id)}>
                            {t("dash.donorsDelete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ----------------------- BackupRestoreCard -----------------------

function BackupRestoreCard({
  t,
  toast,
}: {
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
}) {
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/backup", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rbh-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: t("dash.backupFailed"), variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const res = await fetch("/api/admin/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("dash.backupRestored") });
    } catch {
      toast({ title: t("dash.backupFailed"), variant: "destructive" });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-1 flex items-center gap-2">
        <Database className="h-5 w-5 text-amber-700" />
        <h2 className="font-garamond text-2xl font-bold">
          {t("dash.backupTitle")}
        </h2>
      </div>
      <p className="mb-5 font-im-fell text-sm italic text-foreground/60">
        {t("dash.backupDesc")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={download} disabled={busy}>
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {t("dash.backupDownload")}
        </Button>
        <Button
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          <Upload className="mr-2 h-4 w-4" />
          {t("dash.backupRestore")}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFile}
        />
      </div>
    </Card>
  );
}
