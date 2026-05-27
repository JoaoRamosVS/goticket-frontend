import useMyProfile from "@/features/client/hooks/useMyProfile";
import PasswordForm from "@/features/client/components/PasswordForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MyAccountSecurityPage() {
  const { profile, isLoading } = useMyProfile();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#00334d]">Segurança</h2>
        <p className="text-sm text-[#5e6c87] mt-0.5">Gerencie suas credenciais de acesso.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#00334d] uppercase tracking-wide">
          E-mail de acesso
        </h3>
        <div className="max-w-md space-y-1.5">
          <Label>E-mail</Label>
          <Input
            value={isLoading ? "..." : (profile?.email ?? "")}
            readOnly
            className="bg-muted/40 text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-3">
        <h3 className="text-sm font-bold text-[#00334d] uppercase tracking-wide">
          Alterar senha
        </h3>
        <PasswordForm />
      </div>
    </div>
  );
}
