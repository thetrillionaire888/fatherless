"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/lib/i18n";
import type { Session } from "@/components/dashboard-shell";

export default function LoginShell() {
  const { toast } = useToast();
  const t = useT();
  const router = useRouter();

  const [redirect, setRedirect] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("redirect");
  });
  const [initialMode, setInitialMode] = useState<"signup" | "signin">(() => {
    if (typeof window === "undefined") return "signin";
    return new URLSearchParams(window.location.search).get("mode") === "signup"
      ? "signup"
      : "signin";
  });
  const [resetToken, setResetToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("reset");
  });

  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Refresh session from API.
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
    async function refresh() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as Session;
        setSession(data);
      } catch {
        setSession({ authenticated: false });
      } finally {
        setLoadingSession(false);
      }
    }

    void refresh();
  }, []);

  // If already authenticated, redirect to the correct dashboard.
  // Admins go to /admin, patrons go to /patreon (or a custom redirect URL if provided).
  useEffect(() => {
    if (!session || loadingSession) return;
    if (resetToken) return; // user is mid-reset; don't bounce away
    if (!session.authenticated) return;

    if (redirect && session.role !== "admin") {
      window.location.replace(redirect);
      return;
    }

    // Redirect to the correct dashboard based on role
    const destination = session.role === "admin" ? "/admin" : "/patreon";
    window.location.replace(destination);
  }, [session, loadingSession, redirect, resetToken]);

  // Reset password screen takes priority.
  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (resetToken) {
    return <ResetScreen token={resetToken} t={t} toast={toast} router={router} />;
  }

  // If authenticated, we're in the middle of redirecting — show nothing or a loader.
  if (session?.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    );
  }

  // Otherwise show the auth screen.
  return (
    <AuthScreen
      initialMode={initialMode === "signup" ? "signup" : "signin"}
      t={t}
      toast={toast}
      onAuthed={(role) => {
        // After login/signup, navigate to the role-appropriate dashboard.
        const destination = role === "admin" ? "/admin" : "/patreon";
        if (typeof window !== "undefined") {
          window.location.href = destination;
        }
      }}
    />
  );
}

// ----------------------- AuthScreen -----------------------

function AuthScreen({
  initialMode,
  t,
  toast,
  onAuthed,
}: {
  initialMode: "signin" | "signup";
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
  onAuthed: (role: "admin" | "patron") => void;
}) {
  const [tab, setTab] = useState<"signin" | "signup">(initialMode);
  const [mode, setMode] = useState<"auth" | "forgot">("auth");

  // Sign-in fields
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siTotp, setSiTotp] = useState("");

  // Sign-up fields
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  // Forgot password
  const [fpEmail, setFpEmail] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);

  const adminEmail = "jansen.simanullang@gmail.com";
  const isAdminEmail = (e: string) =>
    e.trim().toLowerCase() === adminEmail.toLowerCase();

  const submitSignIn = async () => {
    if (!siEmail || !siPassword) {
      toast({
        title: t("don.err.complete"),
        variant: "destructive",
      });
      return;
    }
    if (isAdminEmail(siEmail) && !siTotp) {
      toast({
        title: t("auth.totp"),
        description: t("auth.totpHint"),
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: siEmail.trim().toLowerCase(),
          password: siPassword,
          totp: siTotp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Login failed", variant: "destructive" });
        return;
      }
      toast({
        title: t("don.loginToastTitle"),
        description: t("don.loginToastDesc"),
      });
      onAuthed(data.role);
    } catch {
      toast({ title: "Login failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const submitSignUp = async () => {
    if (!suEmail || !suPassword) {
      toast({ title: t("don.err.complete"), variant: "destructive" });
      return;
    }
    if (suPassword !== suConfirm) {
      toast({
        title: t("auth.confirmPassword"),
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: suEmail.trim().toLowerCase(),
          password: suPassword,
          confirm: suConfirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Sign up failed", variant: "destructive" });
        return;
      }
      toast({
        title: t("don.signupToastTitle"),
        description: t("don.signupToastDesc"),
      });
      onAuthed(data.role);
    } catch {
      toast({ title: "Sign up failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async () => {
    if (!fpEmail) {
      toast({ title: t("don.err.complete"), variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed", variant: "destructive" });
        return;
      }
      toast({ title: t("auth.forgotSent") });
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  // Forgot password view
  if (mode === "forgot") {
    return (
      <div className="flex min-h-screen items-center justify-center parchment-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          <Card className="p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="font-blackletter text-3xl text-ember">
                {t("auth.forgotTitle")}
              </h1>
              <p className="mt-2 font-im-fell text-sm italic text-foreground/60">
                {t("auth.forgotDesc")}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fpEmail">{t("auth.email")}</Label>
                <Input
                  id="fpEmail"
                  type="email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitForgot();
                  }}
                  placeholder="you@example.com"
                />
              </div>
              {devResetUrl && (
                <div className="rounded-md border border-amber-800/20 bg-amber-50/30 p-3 text-xs">
                  <p className="mb-1 font-medium text-amber-900">Dev reset link:</p>
                  <a
                    href={devResetUrl}
                    className="break-all text-blue-600 underline"
                  >
                    {devResetUrl}
                  </a>
                </div>
              )}
              <Button onClick={submitForgot} disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("auth.forgotBtn")}
              </Button>
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setMode("auth")}
              >
                {t("auth.backToSignIn")}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Sign-in / Sign-up view
  return (
    <div className="flex min-h-screen items-center justify-center parchment-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="mb-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900">
              <Heart className="h-4 w-4" />
              Rumah Buah Hati
            </div>
            <h1 className="font-blackletter text-4xl text-ember">
              {t("don.badge")}
            </h1>
          </div>
        <Card className="p-8 shadow-lg">
          

          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "signin" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t("auth.loginTitle")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.signupTitle")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siEmail">{t("auth.email")}</Label>
                  <Input
                    id="siEmail"
                    type="email"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siPassword">{t("auth.password")}</Label>
                  <Input
                    id="siPassword"
                    type="password"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitSignIn();
                    }}
                  />
                </div>
                {isAdminEmail(siEmail) && (
                  <div className="grid gap-2">
                    <Label htmlFor="siTotp">{t("auth.totp")}</Label>
                    <Input
                      id="siTotp"
                      inputMode="numeric"
                      value={siTotp}
                      onChange={(e) => setSiTotp(e.target.value)}
                      placeholder="123456"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("auth.totpHint")}
                    </p>
                  </div>
                )}
                <Button onClick={submitSignIn} disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth.signInBtn")}
                </Button>
                <Button
                  variant="link"
                  className="text-sm"
                  onClick={() => setMode("forgot")}
                >
                  {t("auth.forgotLink")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="suEmail">{t("auth.email")}</Label>
                  <Input
                    id="suEmail"
                    type="email"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suPassword">{t("auth.password")}</Label>
                  <Input
                    id="suPassword"
                    type="password"
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suConfirm">{t("auth.confirmPassword")}</Label>
                  <Input
                    id="suConfirm"
                    type="password"
                    value={suConfirm}
                    onChange={(e) => setSuConfirm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitSignUp();
                    }}
                  />
                </div>
                <Button onClick={submitSignUp} disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("auth.signUpBtn")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}

// ----------------------- ResetScreen -----------------------

function ResetScreen({
  token,
  t,
  toast,
  router,
}: {
  token: string;
  t: (k: string) => string;
  toast: ReturnType<typeof useToast>["toast"];
  router: ReturnType<typeof useRouter>;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!password || !confirm) {
      toast({ title: t("don.err.complete"), variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: t("auth.confirmPassword"), variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Reset failed", variant: "destructive" });
        return;
      }
      toast({ title: t("auth.passwordResetOk") });
      router.replace("/login");
    } catch {
      toast({ title: "Reset failed", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center parchment-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="font-blackletter text-3xl text-ember">
              {t("auth.resetTitle")}
            </h1>
            <p className="mt-2 font-im-fell text-sm italic text-foreground/60">
              {t("auth.resetDesc")}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rPassword">{t("auth.newPassword")}</Label>
              <Input
                id="rPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rConfirm">{t("auth.confirmPassword")}</Label>
              <Input
                id="rConfirm"
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
              {t("auth.resetBtn")}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}