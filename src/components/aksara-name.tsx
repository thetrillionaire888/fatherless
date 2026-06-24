"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Displays the full official name of the orphanage in two layers:
 *  - the archaic Javanese script (Aksara Jawa)
 *  - the Latin-script Bahasa Indonesia name
 *
 * `variant` controls sizing for different placements (hero / footer / map detail).
 */
export function AksaraName({
  aksaraJawa,
  fullName,
  variant = "default",
  className,
}: {
  aksaraJawa: string;
  fullName: string;
  variant?: "hero" | "default" | "compact";
  className?: string;
}) {
  const aksaraSize =
    variant === "hero"
      ? "text-2xl sm:text-3xl"
      : variant === "compact"
        ? "text-base"
        : "text-xl";
  const nameSize =
    variant === "hero"
      ? "text-sm"
      : variant === "compact"
        ? "text-[0.7rem]"
        : "text-xs";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("flex flex-col items-center gap-0.5 text-center", className)}
    >
      <span
        className={cn(
          "font-javanese leading-relaxed text-ember",
          aksaraSize
        )}
        lang="jv"
        dir="ltr"
      >
        {aksaraJawa}
      </span>
      <span
        className={cn(
          "font-im-fell uppercase tracking-[0.18em] text-ember",
          nameSize
        )}
      >
        {fullName}
      </span>
    </motion.div>
  );
}
