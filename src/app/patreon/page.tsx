import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DashboardShell from "@/components/dashboard-shell";

export default function PatreonPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-amber-700" /></div>}>
      <DashboardShell expectedRole="patron" />
    </Suspense>
  );
}
