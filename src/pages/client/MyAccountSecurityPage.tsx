import useMyProfile from "@/features/client/hooks/useMyProfile";
import PasswordForm from "@/features/client/components/PasswordForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MyAccountSecurityPage() {
  const { profile, isLoading } = useMyProfile();

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3.5 bg-linear-to-b from-primary to-[#2959b9] rounded-2xl p-6 shadow-2xl">
        <div>
          <h2 className="text-4xl font-extrabold text-card">Segurança</h2>
          <p className="text-sm font-light text-card mt-3">Gerencie suas credenciais de acesso.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#5e6c87] uppercase tracking-widest">
          E-mail de acesso
        </h3>
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input
            value={isLoading ? "..." : (profile?.email ?? "")}
            readOnly
            className="bg-white/50 border-[#c8e2f5] rounded-xl text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <div className="relative h-px">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#2a8fd4]/25 to-transparent" />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#5e6c87] uppercase tracking-widest">
          Alterar senha
        </h3>
        <PasswordForm />
      </div>
    </div>
  );
}
