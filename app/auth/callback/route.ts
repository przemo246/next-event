import { createClient } from "@/core/supabase/server";
import { redirectTo, safePath } from "../redirect";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safePath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectTo(request, next);
    }
  }

  return redirectTo(request, "/login?error=oauth");
}
