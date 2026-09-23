"use client";

import { useActionState, type ReactNode } from "react";
import { register } from "../actions/register";
import { ConfirmationSent } from "./confirmation-sent";
import { RegisterForm } from "./register-form";

type RegisterCardProps = {
  // OAuth buttons and tabs; rendered on the server and hidden once the
  // confirmation e-mail has been sent.
  intro: ReactNode;
};

export const RegisterCard = ({ intro }: RegisterCardProps) => {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <div className="flex flex-col gap-6 border border-border bg-canvas-raised p-8">
      {state && "confirmationSentTo" in state ? (
        <ConfirmationSent email={state.confirmationSentTo} />
      ) : (
        <>
          {intro}
          <RegisterForm
            state={state}
            formAction={formAction}
            pending={pending}
          />
        </>
      )}
    </div>
  );
};
