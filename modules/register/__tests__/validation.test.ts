import { describe, expect, it } from "vitest";
import {
  MIN_PASSWORD_LENGTH,
  RESERVED_USERNAMES,
  isReservedUsername,
  passwordsSchema,
  usernameSchema,
} from "../helpers/validation";

const firstIssue = (input: unknown) => {
  const parsed = usernameSchema.safeParse(input);
  return parsed.success ? null : parsed.error.issues[0];
};

const firstPasswordIssue = (input: unknown) => {
  const parsed = passwordsSchema.safeParse(input);
  return parsed.success ? null : parsed.error.issues[0];
};

describe("isReservedUsername", () => {
  // One case per entry. The e2e suite only ever checked "admin", so a typo in
  // any of the other 13 used to pass silently.
  it.each(RESERVED_USERNAMES)("rejects the reserved name %s", (name) => {
    expect(isReservedUsername(name)).toBe(true);
  });

  it.each(["jan", "janek", "administer", "admins", "log", "helpdesk", "profilu"])(
    "allows %s",
    (name) => {
      expect(isReservedUsername(name)).toBe(false);
    },
  );

  it("has no duplicates", () => {
    expect(new Set(RESERVED_USERNAMES).size).toBe(RESERVED_USERNAMES.length);
  });
});

describe("usernameSchema", () => {
  it.each([
    ["exactly 3 characters", "ab_", null],
    ["exactly 30 characters", "a".repeat(30), null],
    ["lowercase letters", "jane_roe", null],
    ["digits", "user123", null],
    ["underscores", "__jane__", null],
  ])("accepts %s", (_case, input, expectedError) => {
    expect(firstIssue(input)?.message ?? null).toBe(expectedError);
  });

  it.each([
    ["2 characters", "ab", "Nazwa użytkownika musi mieć co najmniej 3 znaki."],
    ["31 characters", "a".repeat(31), "Nazwa użytkownika może mieć maksymalnie 30 znaków."],
  ])("rejects %s", (_case, input, message) => {
    expect(firstIssue(input)?.message).toBe(message);
  });

  // Written with \u escapes so the file survives any encoding round-trip on the
  // way to disk. A Polish diacritic is rejected rather than transliterated, so
  // "zażółć" has to be typed as "zazolc".
  it.each([
    ["a space", "jan ek"],
    ["a dash", "jan-ek"],
    ["a dot", "jan.ek"],
    ["an at sign", "jan@ek"],
    ["a slash", "jan/ek"],
    ["a Polish letter: ł", "za\u0142\u00f3\u0142\u0107"],
    ["a Polish letter: ą", "zaz\u0105\u0142\u0107"],
    ["a Polish letter: ę", "zaz\u0119\u0142\u0107"],
    ["a Polish letter: ó", "zaz\u00f3\u0142\u0107"],
    ["a Polish letter: ś", "zaz\u015b\u0142\u0107"],
    ["a Polish letter: ż", "za\u017c\u00f3\u0142\u0107"],
    ["a Polish letter: ź", "zaz\u017a\u00f3\u0142\u0107"],
    ["a Polish letter: ć", "zazo\u0107\u0142\u0107"],
    ["a Polish letter: ń", "zazo\u0144\u0142\u0107"],
    ["an emoji", "janek\ud83d\ude42"],
  ])("rejects %s", (_case, input) => {
    expect(firstIssue(input)?.message).toBe(
      "Użyj tylko małych liter, cyfr i podkreśleń.",
    );
  });

  it("accepts uppercase input by normalising it, not by rejecting it", () => {
    // The action lowercases before it ever reaches the database, so "Janek" is
    // a valid input that produces "janek" rather than a charset error.
    const parsed = usernameSchema.safeParse("Janek");

    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data).toBe("janek");
  });

  it("lowercases and trims before validating", () => {
    const parsed = usernameSchema.safeParse("  JANEK  ");

    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data).toBe("janek");
  });

  it("rejects a reserved name only after normalising", () => {
    // "Admin" has to fail as reserved, not slip through as a valid charset.
    expect(firstIssue("  ADMIN  ")?.message).toBe("Ta nazwa jest zarezerwowana.");
  });

  it("rejects a reserved name that is also too short", () => {
    // "api" is both reserved and exactly 3 characters, so the length check
    // passes and the reserved check is what must reject it.
    expect(firstIssue("api")?.message).toBe("Ta nazwa jest zarezerwowana.");
  });

  it("reports the length error before the charset error", () => {
    // Guards the order the action reads issues[0] from, since that message is
    // what the user sees.
    expect(firstIssue("A")?.message).toBe(
      "Nazwa użytkownika musi mieć co najmniej 3 znaki.",
    );
  });
});

describe("passwordsSchema", () => {
  const lengthError = `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`;
  const atLimit = "a".repeat(MIN_PASSWORD_LENGTH);

  it("accepts a matching pair", () => {
    expect(
      firstPasswordIssue({ password: "abcdef", confirmPassword: "abcdef" }),
    ).toBeNull();
  });

  it("accepts a password of exactly the limit", () => {
    expect(
      firstPasswordIssue({ password: atLimit, confirmPassword: atLimit }),
    ).toBeNull();
  });

  it("rejects a password one character under the limit", () => {
    const short = "a".repeat(MIN_PASSWORD_LENGTH - 1);

    expect(firstPasswordIssue({ password: short, confirmPassword: short })
      ?.message).toBe(lengthError);
  });

  it("rejects a mismatched pair", () => {
    expect(
      firstPasswordIssue({
        password: "abcdef",
        confirmPassword: "different-password",
      })?.message,
    ).toBe("Hasła nie są takie same.");
  });

  it("reports the length error before the mismatch", () => {
    // The action surfaces one message, so two different short passwords have to
    // read as a length problem -- the mismatch would just be noise about a
    // password the user has to retype anyway.
    expect(firstPasswordIssue({ password: "ab", confirmPassword: "cd" })
      ?.message).toBe(lengthError);
  });

  it("reports a mismatch when only the repeat is wrong", () => {
    expect(
      firstPasswordIssue({ password: atLimit, confirmPassword: `${atLimit}x` })
        ?.message,
    ).toBe("Hasła nie są takie same.");
  });

  it("treats an empty repeat as a mismatch rather than a length error", () => {
    // The action rejects an empty password before this schema sees it, so the
    // only empty repeat reaching here is a forgotten field. Saying the password
    // is too short would send the user off to retype the one they got right.
    expect(
      firstPasswordIssue({ password: atLimit, confirmPassword: "" })?.message,
    ).toBe("Hasła nie są takie same.");
  });
});
