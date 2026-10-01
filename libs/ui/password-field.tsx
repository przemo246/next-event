"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/libs/cn";
import { Text } from "@/libs/ui/text";

export type PasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
  // See TextField.hint -- same reasoning applies here.
  hint?: string;
};

// A TextField variant with a show/hide toggle. The input stays type="password"
// by default and only switches to type="text" while the user holds the toggle
// open, same as every other "show password" button.
export const PasswordField = ({
  label,
  hint,
  className,
  id,
  name,
  ...props
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id ?? name;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5" htmlFor={inputId}>
        <Text.Eyebrow>{label}</Text.Eyebrow>
        <div className="relative">
          <input
            id={inputId}
            name={name}
            type={isVisible ? "text" : "password"}
            aria-describedby={hint ? hintId : undefined}
            className={cn(
              "w-full border border-border-strong bg-canvas px-4 py-3 pr-11 text-[15px] text-foreground outline-none focus:border-accent",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible((value) => !value)}
            aria-label={isVisible ? "Ukryj hasło" : "Pokaż hasło"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground-muted outline-none hover:text-accent"
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </label>
      {hint && <Text.Caption id={hintId}>{hint}</Text.Caption>}
    </div>
  );
};
