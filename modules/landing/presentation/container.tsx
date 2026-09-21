import { ComponentProps } from "react";

export const Container = ({
  className = "",
  ...props
}: ComponentProps<"div">) => {
  return <div className={`mx-auto max-w-7xl ${className}`} {...props} />;
};
