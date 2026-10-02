import { createClient } from "./server";

export const getJWTClaims = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims;
};
