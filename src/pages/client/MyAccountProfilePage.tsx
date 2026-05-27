import useMyProfile from "@/features/client/hooks/useMyProfile";
import ProfileForm from "@/features/client/components/ProfileForm";

export default function MyAccountProfilePage() {
  const { profile, isLoading, error, refetch } = useMyProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
        {error ?? "Não foi possível carregar o perfil."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#00334d]">Dados pessoais</h2>
        <p className="text-sm text-[#5e6c87] mt-0.5">CPF e data de nascimento não podem ser alterados.</p>
      </div>
      <ProfileForm profile={profile} onSaved={refetch} />
    </div>
  );
}
