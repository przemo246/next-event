import type { ComponentProps } from "react";

import { cn } from "@/libs/cn";
import { Text } from "@/libs/ui/text";

export type TextFieldProps = ComponentProps<"input"> & {
  label: string;
};

export const TextField = ({ label, className, id, name, ...props }: TextFieldProps) => (
  <label className="flex flex-col gap-1.5">
    <Text.Eyebrow>{label}</Text.Eyebrow>
    <input
      id={id ?? name}
      name={name}
      className={cn(
        "border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent",
        className,
      )}
      {...props}
    />
  </label>
);
