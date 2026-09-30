import { describe, expect, it } from "vitest";
import { safePath } from "../safe-path";

// The e2e suite covered only `token_hash=invalid` and never passed a `next`
// parameter at all, so none of these were actually verified.
describe("safePath", () => {
  it.each(["/", "/login", "/create-event", "/wydarzenia", "/a/b/c?d=e#f"])(
    "allows the same-origin path %s",
    (path) => {
      expect(safePath(path)).toBe(path);
    },
  );

  it.each([
    ["null", null],
    ["an empty string", ""],
    ["a protocol-relative URL", "//evil.com"],
    ["a protocol-relative URL with a path", "//evil.com/phish"],
    ["a backslash after the slash", "/\\evil.com"],
    ["an absolute http URL", "http://evil.com"],
    ["an absolute https URL", "https://evil.com"],
    ["a bare host", "evil.com"],
    ["an at sign", "@evil.com"],
    ["a relative path", "login"],
    ["a scheme-relative javascript URL", "javascript:alert(1)"],
  ])("falls back to / for %s", (_case, input) => {
    expect(safePath(input)).toBe("/");
  });

  it("rejects a backslash-prefixed host even with extra slashes", () => {
    expect(safePath("/\\/\\evil.com")).toBe("/");
  });
});
