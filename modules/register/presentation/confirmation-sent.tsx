import { ResendButton } from "@/shared/email-confirmation/presentation/resend-button";
import { Text } from "@/libs/ui/text";

type ConfirmationSentProps = {
  email: string;
};

export const ConfirmationSent = ({ email }: ConfirmationSentProps) => (
  <div className="flex flex-col gap-4">
    <Text.Eyebrow>Sprawdź skrzynkę</Text.Eyebrow>
    <Text.H2 className="text-2xl">Potwierdź adres e-mail</Text.H2>
    <Text.Lead>
      Wysłaliśmy link aktywacyjny na adres{" "}
      <Text.Strong>{email}</Text.Strong>. Kliknij go,
      aby dokończyć rejestrację. Jeśli nie widzisz wiadomości, zajrzyj do
      folderu spam.
    </Text.Lead>
    <ResendButton email={email} justSent />
  </div>
);
