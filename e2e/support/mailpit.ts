import { expect } from "@playwright/test";

// Local Supabase routes all auth e-mails to Mailpit (`[local_smtp]` in supabase/config.toml).
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

type MailpitSearch = {
  messages: { ID: string }[];
};

type MailpitMessage = {
  HTML: string;
};

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${MAILPIT_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Mailpit ${path} responded with ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const waitForEmail = async (to: string): Promise<MailpitMessage> => {
  let id: string | undefined;

  await expect
    .poll(
      async () => {
        const query = encodeURIComponent(`to:"${to}"`);
        const { messages } = await getJson<MailpitSearch>(
          `/api/v1/search?query=${query}`,
        );
        id = messages[0]?.ID;
        return id;
      },
      { message: `e-mail to ${to} never arrived`, timeout: 15_000 },
    )
    .toBeTruthy();

  return getJson<MailpitMessage>(`/api/v1/message/${id}`);
};

// Returns the path + query of the confirmation link, so it can be opened
// against Playwright's baseURL.
export const extractConfirmLink = (html: string): string => {
  const match = html.match(/href="([^"]*\/auth\/confirm\?[^"]*)"/);
  if (!match) {
    throw new Error("No /auth/confirm link found in the e-mail");
  }
  const url = new URL(match[1].replaceAll("&amp;", "&"));
  return `${url.pathname}${url.search}`;
};
