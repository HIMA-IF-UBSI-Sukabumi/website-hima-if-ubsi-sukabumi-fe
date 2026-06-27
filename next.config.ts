import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      // Local dev – API storage
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/storage/**',
      },
      // Production – allow any HTTPS host (restrict to your domain in prod)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

