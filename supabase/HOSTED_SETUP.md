# Hosted Supabase setup

Settings the hosted project needs that `config.toml` does not apply on its own.
Do these in the Supabase Dashboard for the production project.

## Email confirmation

- [ ] **Enable email confirmation**
      Authentication → Sign In / Providers → Email → turn on **Confirm email**.

- [ ] **Replace the "Confirm signup" template**
      Authentication → Emails → Templates → Confirm signup.
      - Subject: `Potwierdź swój adres e-mail`
      - Body: copy [`templates/confirmation.html`](templates/confirmation.html).
        The link must point to `/auth/confirm` with `token_hash`:

        ```html
        {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
        ```

        The default template uses `{{ .ConfirmationURL }}`, which bypasses
        `app/auth/confirm/route.ts`, so confirmation won't work with it.

- [ ] **Set the Site URL and redirect URLs**
      Authentication → URL Configuration.
      - Site URL: the production domain, e.g. `https://example.com`
        (`{{ .SiteURL }}` in the template resolves to this).
      - Redirect URLs: add the production domain, plus preview domains if
        used, e.g. `https://*-your-team.vercel.app/**`.

- [ ] **Configure custom SMTP**
      Project Settings → Authentication → SMTP Settings.
      Supabase's built-in email sender only delivers to project team members
      and is limited to a few emails per hour, so real users won't receive
      confirmation emails without it. Use a provider such as Resend, Postmark or
      Amazon SES, with a verified sender domain.

- [ ] **Review the email rate limit**
      Authentication → Rate Limits → emails sent per hour.
      Once custom SMTP is set, raise it to match expected sign-up volume. The
      resend button in the app also sends emails and counts toward this limit.

## Verify

- [ ] Sign up with a new address and check that the email arrives and its
      link opens `/auth/confirm` on the production domain.
- [ ] Clicking the link logs the user in and redirects them to `/`.
- [ ] An already-used or expired link redirects to `/login?error=confirm`.
- [ ] Logging in before confirming shows the "confirm your email" message and a
      working resend button.

## If deployed behind a reverse proxy

The auth routes build redirects from the `x-forwarded-host` and
`x-forwarded-proto` headers (see `app/auth/redirect.ts`). Make sure the proxy
sets both and overwrites any values sent by the client; Vercel does this by
default.
