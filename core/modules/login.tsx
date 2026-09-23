import { Main } from "@/modules/login/presentation/main";

type ModuleProps = {
  linkError?: boolean;
};

export const Module = ({ linkError }: ModuleProps) => {
  return <Main linkError={linkError} />;
};
