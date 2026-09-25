import { createClient } from "@supabase/supabase-js";

const requireEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy the server-only Supabase key from \`pnpm db:status\` into .env.local.`,
    );
  }

  return value;
};

export const createSupabaseAdminClient = () => {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
