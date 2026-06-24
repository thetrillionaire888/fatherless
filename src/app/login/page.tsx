import { Suspense } from "react";

import LoginShell from "@/components/login-shell";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginShell />
    </Suspense>
  );
}
