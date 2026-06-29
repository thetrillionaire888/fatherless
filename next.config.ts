import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "*.chatglm.cn", "127.0.0.1", "localhost"],

  // 👇 PRIMARY FIX: Treat @libsql/* as runtime externals so Next.js
  //    copies the entire package (including optional peer deps like
  //    @libsql/isomorphic-ws and platform-specific native bindings)
  //    into .next/standalone/node_modules instead of bundling them.
  serverExternalPackages: [
    "@libsql/client",
    "@libsql/hrana-client",
    "@libsql/core",
    "@libsql/isomorphic-ws",
    "libsql",
  ],

  // 👇 SAFETY NET: Force-include any @libsql files that the tracer
  //    might still miss (covers edge cases like optionalDependencies
  //    and platform-specific bindings).
  //    NOTE: keys must be route paths, NOT package names.
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/@libsql/**/*",
      "./node_modules/libsql/**/*",
      "./node_modules/isomorphic-ws/**/*",
    ],
  },
};

export default nextConfig;