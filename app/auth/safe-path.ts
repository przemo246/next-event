// Only allow same-origin paths, never "//evil.com", "@evil.com" or absolute
// URLs. Split out from ./redirect so the rule can be unit tested without
// pulling in `next/server`.
//
// A leading backslash is rejected too: some browsers normalise "/\evil.com" to
// "//evil.com", which `startsWith("//")` alone would miss.
export const safePath = (path: string | null) => {
  if (!path) return "/";
  if (!path.startsWith("/")) return "/";
  if (path.startsWith("//")) return "/";
  if (path.startsWith("/\\")) return "/";

  return path;
};
