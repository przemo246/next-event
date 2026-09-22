import { signInWithFacebook, signInWithGoogle } from "../actions/oauth";
import { FacebookIcon, GoogleIcon } from "./icons";

const buttonClassName =
  "flex w-full cursor-pointer items-center justify-center gap-3 border border-border-strong bg-canvas-raised px-5 py-3 font-display text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent";

export const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-3">
      <form action={signInWithFacebook}>
        <button type="submit" className={buttonClassName}>
          <FacebookIcon />
          Kontynuuj z Facebookiem
        </button>
      </form>

      <form action={signInWithGoogle}>
        <button type="submit" className={buttonClassName}>
          <GoogleIcon />
          Kontynuuj z Google
        </button>
      </form>
    </div>
  );
};
