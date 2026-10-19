import { createClient } from "./server";

export const getJWTClaims = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  // Without this the caller only sees `undefined` and renders the header as
  // logged out, so a failed lookup is indistinguishable from no session.
  if (error) {
    console.error(
      "[Auth Error] getJWTClaims failed:",
      error.message,
      error.code,
    );
    return undefined;
  }

  return data?.claims;
};
