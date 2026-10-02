import type { ComponentProps } from "react";

import { cn } from "@/libs/cn";
import { Text } from "@/libs/ui/text";

export type SelectFieldProps = ComponentProps<"select"> & {
  label: string;
};

export const SelectField = ({
  label,
  className,
  id,
  name,
  children,
  ...props
}: SelectFieldProps) => {
  const selectId = id ?? name;

  return (
    <label className="flex flex-col gap-1.5" htmlFor={selectId}>
      <Text.Eyebrow>{label}</Text.Eyebrow>
      <select
        id={selectId}
        name={name}
        className={cn(
          "border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};
