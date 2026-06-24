"use client";

import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { GlobeAnimation } from "./globe-animation";
import { useT } from "@/lib/i18n";

export function GlobeSection() {
  const t = useT();
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Dark cosmic background for the globe */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.25 0.04 55), oklch(0.15 0.03 55) 60%, oklch(0.10 0.02 55) 100%)",
        }}
      />
      {/* Stars */}
      <div className="absolute inset-0 opacity-60">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-100"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: i % 7 === 0 ? "2px" : "1px",
              height: i % 7 === 0 ? "2px" : "1px",
              opacity: 0.3 + ((i * 13) % 50) / 100,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-900/20 px-4 py-1.5 text-sm font-medium text-amber-200">
            <Globe2 className="h-4 w-4" />
            {t("globe.badge")}
          </div>
          <h2 className="font-blackletter text-4xl leading-tight text-amber-100 sm:text-5xl">
            {t("globe.heading")}
          </h2>
          <p className="mt-4 font-im-fell text-lg italic text-amber-100/70">
            {t("globe.subtitle")}
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <GlobeAnimation />
        </div>
      </div>
    </section>
  );
}
