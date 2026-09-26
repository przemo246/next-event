import { deleteLoginUser } from "./support/test-user";

export default async function globalTeardown() {
  await deleteLoginUser();
}
