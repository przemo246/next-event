import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local Supabase's `site_url` and the e2e tests use 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
