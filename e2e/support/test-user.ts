import { createSupabaseAdminClient } from "./supabase-admin";

export const E2E_EMAIL_PREFIX = "e2e-";

export const E2E_LOGIN_USER = {
  email: "e2e-login@example.com",
  password: "e2e-password-123",
};

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;
type AdminUser = { id: string; email?: string | null };

const listUsers = async (supabase: AdminClient) => {
  const users: AdminUser[] = [];
  const perPage = 1000;

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Could not list Supabase users: ${error.message}`);
    }

    users.push(...data.users);

    if (data.users.length < perPage) {
      return users;
    }
  }
};

const findUserByEmail = async (email: string) => {
  const supabase = createSupabaseAdminClient();
  const users = await listUsers(supabase);
  const normalizedEmail = email.toLowerCase();

  return (
    users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    ) ?? null
  );
};

export const ensureLoginUser = async () => {
  const supabase = createSupabaseAdminClient();
  const existingUser = await findUserByEmail(E2E_LOGIN_USER.email);

  const result = existingUser
    ? await supabase.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true,
        password: E2E_LOGIN_USER.password,
      })
    : await supabase.auth.admin.createUser({
        email: E2E_LOGIN_USER.email,
        email_confirm: true,
        password: E2E_LOGIN_USER.password,
      });

  if (result.error) {
    throw new Error(
      `Could not prepare the E2E login user: ${result.error.message}`,
    );
  }
};

export const deleteUserByEmail = async (email: string) => {
  const supabase = createSupabaseAdminClient();
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(`Could not delete the E2E user ${email}: ${error.message}`);
  }
};

export const deleteTestUsers = async () => {
  const supabase = createSupabaseAdminClient();
  const users = await listUsers(supabase);
  const testUsers = users.filter((user) =>
    user.email?.toLowerCase().startsWith(E2E_EMAIL_PREFIX),
  );

  for (const user of testUsers) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      throw new Error(
        `Could not delete the E2E user ${user.email}: ${error.message}`,
      );
    }
  }
};
