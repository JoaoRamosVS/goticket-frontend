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
      <div className="flex items-start gap-3.5 bg-linear-to-b from-primary to-[#2959b9] rounded-2xl p-6 shadow-2xl">
        <div>
          <h2 className="text-4xl font-extrabold text-card">Dados pessoais</h2>
          <p className="text-sm font-light text-card mt-3">CPF e data de nascimento não podem ser alterados.</p>
        </div>
      </div>
      <ProfileForm profile={profile} onSaved={refetch} />
    </div>
  );
}
