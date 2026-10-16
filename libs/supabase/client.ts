import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/shared/types/db-schema";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
