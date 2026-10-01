import bundleAnalyzer from "@next/bundle-analyzer";
import { clientEnv, getServerEnv } from "./src/shared/config/env.js";

const { apiInternalUrl } = getServerEnv();
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      {
        protocol: new URL(clientEnv.apiUrl).protocol.replace(":", ""),
        hostname: new URL(clientEnv.apiUrl).hostname,
      },
    ],
  },
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${apiInternalUrl}/uploads/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
