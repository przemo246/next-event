import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/db-schema";

const requireEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy the Supabase URL and server-only key from \`pnpm exec supabase status -o env\` into .env.local.`,
    );
  }

  return value;
};

export const createSupabaseAdminClient = () => {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
