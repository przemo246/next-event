import { Text } from "@/libs/ui/text";

export const Divider = () => (
  <div className="flex items-center gap-4">
    <div className="h-px flex-1 bg-border" />
    <Text.Eyebrow>Lub</Text.Eyebrow>
    <div className="h-px flex-1 bg-border" />
  </div>
);
