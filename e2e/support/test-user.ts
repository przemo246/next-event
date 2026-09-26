import { createSupabaseAdminClient } from "./supabase-admin";

export const E2E_LOGIN_USER = {
  email: "e2e-login@example.com",
  password: "e2e-password-123",
};

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

const findUserByEmail = async (supabase: AdminClient, email: string) => {
  const perPage = 1000;

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Could not list Supabase users: ${error.message}`);
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }
  }
};

export const ensureLoginUser = async () => {
  const supabase = createSupabaseAdminClient();
  const existingUser = await findUserByEmail(supabase, E2E_LOGIN_USER.email);

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

export const deleteLoginUser = async () => {
  const supabase = createSupabaseAdminClient();
  const user = await findUserByEmail(supabase, E2E_LOGIN_USER.email);

  if (!user) {
    return;
  }

  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(`Could not delete the E2E login user: ${error.message}`);
  }
};
