import useMyProfile from "@/features/client/hooks/useMyProfile";
import AddressForm from "@/features/client/components/AddressForm";

export default function MyAccountAddressPage() {
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
        {error ?? "Não foi possível carregar o endereço."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3.5 bg-linear-to-b from-primary to-[#2959b9] rounded-2xl p-6 shadow-2xl">
        <div>
          <h2 className="text-4xl font-extrabold text-card">Endereço</h2>
          <p className="text-sm font-light text-card mt-3">Seu endereço é utilizado para facilitar futuras compras.</p>
        </div>
      </div>
      <AddressForm profile={profile} onSaved={refetch} />
    </div>
  );
}
