"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, RotateCw, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

type Phase = "rotate" | "zoom" | "reveal";

// Worldwide "cries for help" — screen-space dots floating over the globe.
const CRIES = [
  { top: "18%", left: "22%" },
  { top: "30%", left: "68%" },
  { top: "62%", left: "18%" },
  { top: "70%", left: "55%" },
  { top: "40%", left: "84%" },
  { top: "50%", left: "40%" },
  { top: "25%", left: "48%" },
  { top: "78%", left: "78%" },
  { top: "55%", left: "12%" },
  { top: "15%", left: "60%" },
];

export function GlobeAnimation() {
  const t = useT();
  const [phase, setPhase] = useState<Phase>("rotate");
  const [hasPlayed, setHasPlayed] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Set up the auto-play sequence on mount (timers advance the phase async).
  useEffect(() => {
    timersRef.current = [
      setTimeout(() => setPhase("zoom"), 5200),
      setTimeout(() => {
        setPhase("reveal");
        setHasPlayed(true);
      }, 8200),
    ];
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const replay = () => {
    timersRef.current.forEach(clearTimeout);
    setPhase("rotate");
    setHasPlayed(false);
    timersRef.current = [
      setTimeout(() => setPhase("zoom"), 5200),
      setTimeout(() => {
        setPhase("reveal");
        setHasPlayed(true);
      }, 8200),
    ];
  };

  return (
    <div className="relative w-full">
      <div
        className="relative mx-auto aspect-square w-full max-w-xl"
        aria-label="Rotating globe animation zooming into Bantul, Yogyakarta, Indonesia"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl" />

        <AnimatePresence mode="wait">
          {phase !== "reveal" ? (
            <motion.div
              key="globe"
              className="absolute inset-0"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: phase === "zoom" ? 3.4 : 1,
                opacity: phase === "zoom" ? 0 : 1,
                x: phase === "zoom" ? "-6%" : "0%",
                y: phase === "zoom" ? "8%" : "0%",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: phase === "zoom" ? 2.8 : 1.2, ease: "easeInOut" }}
            >
              <WorldGlobe />
              {/* Cries floating over the globe */}
              {CRIES.map((c, i) => (
                <motion.span
                  key={i}
                  className="absolute h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_4px_rgba(251,191,36,0.7)]"
                  style={{ top: c.top, left: c.left }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.7, 1.3, 0.7],
                  }}
                  transition={{
                    duration: 2 + (i % 3) * 0.6,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="regional"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <RegionalMap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption overlay */}
      <div className="mt-6 min-h-[5.5rem] text-center">
        <AnimatePresence mode="wait">
          {phase === "rotate" && (
            <motion.p
              key="c1"
              className="font-im-fell text-lg italic text-foreground/80 sm:text-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {t("globe.cap1")}
            </motion.p>
          )}
          {phase === "zoom" && (
            <motion.p
              key="c2"
              className="font-im-fell text-lg italic text-foreground/80 sm:text-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {t("globe.cap2")}
            </motion.p>
          )}
          {phase === "reveal" && (
            <motion.div
              key="c3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-im-fell text-lg italic text-foreground/80 sm:text-xl">
                {t("globe.cap3")}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-ember" />
                {t("globe.cap3sub")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Replay */}
      {hasPlayed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex justify-center"
        >
          <button
            onClick={replay}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur transition-colors hover:bg-card hover:text-foreground"
          >
            <RotateCw className="h-4 w-4" />
            {t("globe.replay")}
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- The antique spinning world globe ---------- */
function WorldGlobe() {
  return (
    <div className="absolute inset-0">
      {/* Sphere base — aged cream ocean with spherical depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 36% 30%, oklch(0.93 0.018 92), oklch(0.84 0.035 88) 48%, oklch(0.66 0.05 82) 80%, oklch(0.50 0.05 80) 100%)",
          boxShadow:
            "inset -22px -22px 60px oklch(0.28 0.04 55 / 0.6), inset 16px 16px 44px oklch(0.98 0.03 85 / 0.45), 0 22px 70px oklch(0.22 0.04 55 / 0.55), 0 0 0 1px oklch(0.30 0.04 55 / 0.4)",
        }}
      />
      {/* Scrolling landmass strip, masked to the sphere */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 flex"
          style={{ width: "200%" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <LandmassStrip />
          <LandmassStrip />
        </motion.div>
        {/* Spherical shading overlay — subtle highlight + terminator shadow (kept light so coastlines stay visible) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 26%, oklch(1 0.01 90 / 0.22), transparent 40%), radial-gradient(circle at 72% 78%, oklch(0.18 0.04 55 / 0.55), transparent 60%), radial-gradient(circle at 50% 50%, transparent 72%, oklch(0.26 0.05 55 / 0.4) 100%)",
          }}
        />
      </div>
      {/* Fine graticule — antique cartographic grid */}
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        fill="none"
        stroke="oklch(0.32 0.05 55)"
        strokeWidth="0.35"
      >
        <circle cx="100" cy="100" r="99" />
        {/* meridians */}
        <ellipse cx="100" cy="100" rx="20" ry="99" />
        <ellipse cx="100" cy="100" rx="45" ry="99" />
        <ellipse cx="100" cy="100" rx="72" ry="99" />
        {/* parallels */}
        <ellipse cx="100" cy="100" rx="99" ry="20" />
        <ellipse cx="100" cy="100" rx="99" ry="45" />
        <ellipse cx="100" cy="100" rx="99" ry="72" />
        {/* equator + prime meridian (slightly stronger) */}
        <line x1="1" y1="100" x2="199" y2="100" strokeWidth="0.5" />
        <line x1="100" y1="1" x2="100" y2="199" strokeWidth="0.5" />
      </svg>
      {/* Outer antique meridian ring */}
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-amber-900/30" />
    </div>
  );
}

/*
 * Equirectangular landmass strip (viewBox 0 0 1000 500).
 * Continents drawn with detailed coastline points (lon/lat → x/y) so they
 * read as real landmasses rather than blobs. Coordinates approximate real
 * geography; the strip is duplicated and scrolled for seamless rotation.
 */
const LAND_FILL = "oklch(0.46 0.10 52)";
const LAND_FILL_DARK = "oklch(0.36 0.10 48)";
const COAST = "oklch(0.20 0.05 50)";

const CONTINENTS: { d: string }[] = [
  // North America — Alaska, Canada, USA, Mexico, Central America
  {
    d: "M33,70 L60,55 L100,50 L160,46 L222,45 L280,47 L332,82 L346,106 L322,124 L308,134 L290,145 L278,161 L274,181 L266,177 L248,168 L231,177 L222,194 L196,186 L180,161 L161,147 L155,122 L139,100 L124,88 L82,82 L55,96 Z",
  },
  // Greenland
  { d: "M360,40 L392,37 L422,42 L432,58 L421,73 L397,79 L377,72 L366,57 Z" },
  // South America — broad north, pointed south
  {
    d: "M283,216 L302,218 L332,234 L360,250 L400,265 L392,289 L371,317 L344,340 L322,360 L310,385 L304,397 L298,388 L298,362 L300,335 L290,305 L280,277 L276,254 L280,234 Z",
  },
  // Eurasia — Europe + Asia in one mass, with India + SE Asia peninsulas
  {
    d: "M472,131 L484,150 L512,147 L542,144 L575,136 L608,124 L642,110 L672,94 L668,62 L642,46 L700,38 L778,34 L860,38 L925,44 L975,54 L985,68 L958,80 L920,90 L892,100 L868,108 L848,118 L836,134 L832,150 L826,172 L816,190 L802,198 L792,210 L780,200 L766,196 L752,200 L744,214 L736,206 L722,194 L706,186 L700,176 L712,160 L706,148 L684,140 L658,134 L630,130 L600,130 L572,132 L546,136 L518,134 L490,134 Z",
  },
  // India peninsula (hangs south from Eurasia)
  { d: "M706,186 L712,202 L716,218 L720,232 L726,234 L730,218 L732,202 L726,188 L714,182 Z" },
  // Africa — west bulge, horn, narrowing south
  {
    d: "M453,210 L462,220 L486,236 L520,239 L525,252 L527,266 L535,282 L537,295 L534,312 L540,328 L549,343 L562,344 L575,340 L590,330 L598,316 L610,294 L617,266 L640,222 L622,216 L612,206 L600,184 L592,167 L583,160 L560,158 L535,155 L514,152 L498,150 L486,150 L474,160 L464,172 L456,190 Z",
  },
  // Madagascar
  { d: "M624,318 L630,322 L633,338 L629,350 L624,342 L622,330 Z" },
  // UK / Ireland
  { d: "M478,118 L485,115 L488,124 L484,131 L478,127 Z" },
  // Japan
  { d: "M872,118 L880,122 L886,132 L881,140 L874,132 L870,124 Z" },
  // Australia
  {
    d: "M820,318 L826,342 L844,352 L870,356 L894,350 L906,336 L909,322 L901,306 L884,295 L864,292 L844,298 L828,308 Z",
  },
  // New Zealand
  { d: "M932,360 L940,364 L944,374 L938,380 L933,372 Z" },
  // —— Indonesian / SE Asian archipelago (our target region) ——
  // Sumatra (diagonal NW-SE)
  { d: "M752,232 L766,244 L782,256 L794,268 L786,272 L772,264 L758,252 L748,240 Z" },
  // Java
  { d: "M794,272 L810,270 L824,272 L828,276 L816,278 L800,277 Z" },
  // Borneo
  { d: "M800,208 L820,210 L834,220 L832,238 L818,244 L804,236 L798,222 Z" },
  // Sulawesi
  { d: "M836,238 L845,240 L850,252 L844,258 L839,250 L838,242 Z" },
  // New Guinea
  { d: "M852,256 L882,253 L912,256 L924,262 L912,268 L882,267 L858,265 Z" },
  // Philippines (small cluster)
  { d: "M840,210 L846,216 L848,226 L842,228 L838,218 Z" },
];

function LandmassStrip() {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-1/2 flex-shrink-0"
    >
      <defs>
        <linearGradient id="land-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LAND_FILL} />
          <stop offset="100%" stopColor={LAND_FILL_DARK} />
        </linearGradient>
      </defs>
      {/* Coastlines + land fill */}
      <g
        fill="url(#land-grad)"
        stroke={COAST}
        strokeWidth="2.2"
        strokeLinejoin="round"
      >
        {CONTINENTS.map((c, i) => (
          <path key={i} d={c.d} />
        ))}
      </g>
      {/* Subtle interior terrain hint — faint mountain ridge ticks on major landmasses */}
      <g
        fill="none"
        stroke={LAND_FILL_DARK}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      >
        <path d="M120,120 L150,140 L175,160" />
        <path d="M560,180 L600,210 L630,240" />
        <path d="M820,150 L855,175 L880,165" />
        <path d="M340,300 L360,330 L350,360" />
      </g>
      {/* Highlight the Indonesian archipelago (our target) with a warm ember glow */}
      <g>
        <circle cx="808" cy="273" r="22" fill="oklch(0.74 0.17 58)" fillOpacity="0.22" />
        <circle cx="808" cy="273" r="12" fill="oklch(0.74 0.17 58)" fillOpacity="0.35" />
        <circle cx="808" cy="273" r="5" fill="oklch(0.85 0.16 60)">
          <animate
            attributeName="r"
            values="4;6.5;4"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}

/* ---------- Regional map: Java with Bantul marked ---------- */
function RegionalMap() {
  const R_LAND = "oklch(0.50 0.09 55)";
  const R_LAND_DK = "oklch(0.42 0.09 50)";
  const R_COAST = "oklch(0.26 0.05 52)";
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, oklch(0.32 0.06 70), oklch(0.22 0.05 65) 65%, oklch(0.14 0.04 60) 100%)",
          boxShadow:
            "0 0 60px oklch(0.6 0.12 55 / 0.4), inset 0 0 50px oklch(0.1 0.03 55 / 0.5)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <defs>
            <linearGradient id="r-land-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={R_LAND} />
              <stop offset="100%" stopColor={R_LAND_DK} />
            </linearGradient>
          </defs>
          {/* Sea — fine lat/long graticule for cartographic feel */}
          <g
            fill="none"
            stroke="oklch(0.60 0.06 70)"
            strokeWidth="0.4"
            opacity="0.25"
          >
            {[60, 120, 180, 240].map((x) => (
              <line key={`v${x}`} x1={x} y1="20" x2={x} y2="280" />
            ))}
            {[80, 140, 200, 260].map((y) => (
              <line key={`h${y}`} x1="20" y1={y} x2="380" y2={y} />
            ))}
          </g>
          {/* Islands with crisp coastlines */}
          <g
            fill="url(#r-land-grad)"
            stroke={R_COAST}
            strokeWidth="0.7"
            strokeLinejoin="round"
          >
            {/* Sumatra (partial, diagonal, left) */}
            <path d="M30,80 L58,92 L82,120 L108,160 L124,196 L108,200 L86,170 L62,140 L40,108 Z" />
            {/* Java (elongated, center) — more detailed coast */}
            <path d="M120,188 L160,180 L210,182 L260,184 L310,180 L340,176 L348,186 L338,196 L300,198 L250,200 L200,198 L150,196 L122,194 Z" />
            {/* Bali (small, right of Java) */}
            <path d="M354,184 L366,183 L370,188 L362,193 L352,191 Z" />
            {/* Madura (small, above Surabaya) */}
            <path d="M300,165 L326,164 L330,170 L318,174 L302,172 Z" />
            {/* Borneo (partial, top) */}
            <path d="M200,70 L250,66 L286,84 L296,116 L286,146 L258,156 L226,148 L206,124 L196,96 Z" />
            {/* Sulawesi (partial, far right top) */}
            <path d="M340,90 L356,96 L360,112 L350,120 L344,108 Z" />
          </g>
          {/* Subtle mountain spine on Java */}
          <path
            d="M140,186 L190,184 L240,186 L290,184 L330,182"
            fill="none"
            stroke={R_LAND_DK}
            strokeWidth="0.6"
            opacity="0.6"
          />

          {/* City labels */}
          <text x="150" y="216" fill="oklch(0.78 0.05 80)" fontSize="9" className="font-im-fell">
            Jakarta
          </text>
          <text x="300" y="216" fill="oklch(0.78 0.05 80)" fontSize="9" className="font-im-fell">
            Surabaya
          </text>
          <text x="236" y="158" fill="oklch(0.78 0.05 80)" fontSize="9" className="font-im-fell">
            Semarang
          </text>

          {/* Target: Bantul, Yogyakarta */}
          <g>
            <motion.circle
              cx="218"
              cy="190"
              r="22"
              fill="oklch(0.74 0.17 58)"
              fillOpacity="0.18"
              animate={{ r: [16, 26, 16], opacity: [0.5, 0.1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="218" cy="190" r="6" fill="oklch(0.80 0.17 55)" />
            <circle cx="218" cy="190" r="3" fill="oklch(0.95 0.08 70)" />
          </g>
          {/* Label line + callout */}
          <line
            x1="218"
            y1="190"
            x2="218"
            y2="248"
            stroke="oklch(0.78 0.12 60)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <text
            x="188"
            y="262"
            fill="oklch(0.88 0.10 65)"
            fontSize="12"
            className="font-im-fell"
            fontWeight="bold"
          >
            BANTUL
          </text>
          <text
            x="174"
            y="275"
            fill="oklch(0.72 0.05 75)"
            fontSize="8"
            className="font-im-fell"
          >
            Yogyakarta
          </text>
        </svg>
      </div>
      {/* Sparkles around the marker */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-6 w-6 text-amber-300/50" />
      </motion.div>
    </div>
  );
}
