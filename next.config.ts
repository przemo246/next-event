import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local Supabase's `site_url` and the e2e tests use 127.0.0.1 rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    serverActions: {
      // Server Action bodies are capped at 1MB by default, but the create-event
      // form accepts images up to 3MB. Leave room for multipart overhead.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
