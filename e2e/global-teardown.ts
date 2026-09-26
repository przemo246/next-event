import { deleteTestUsers } from "./support/test-user";

export default async function globalTeardown() {
  await deleteTestUsers();
}
