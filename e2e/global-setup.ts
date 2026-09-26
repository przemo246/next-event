import { ensureLoginUser } from "./support/test-user";

export default async function globalSetup() {
  await ensureLoginUser();
}
