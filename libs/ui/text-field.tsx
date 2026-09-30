import type { ComponentProps } from "react";

import { cn } from "@/libs/cn";
import { Text } from "@/libs/ui/text";

export type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  // Rendered under the input and wired up with aria-describedby, for rules the
  // native validation tooltip cannot state in the user's language. It sits
  // outside the <label> on purpose: a label's accessible name is computed from
  // its whole subtree, so nested hint text would end up read as part of the
  // field's name instead of its description.
  hint?: string;
};

export const TextField = ({
  label,
  hint,
  className,
  id,
  name,
  ...props
}: TextFieldProps) => {
  const inputId = id ?? name;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5" htmlFor={inputId}>
        <Text.Eyebrow>{label}</Text.Eyebrow>
        <input
          id={inputId}
          name={name}
          aria-describedby={hint ? hintId : undefined}
          className={cn(
            "border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent",
            className,
          )}
          {...props}
        />
      </label>
      {hint && <Text.Caption id={hintId}>{hint}</Text.Caption>}
    </div>
  );
};
