import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "../utils/address.schema";
import type { ClientProfileDTO } from "../types/client-profile.types";
import useUpdateMyProfile from "../hooks/useUpdateMyProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

interface Props {
  profile: ClientProfileDTO;
  onSaved?: () => void;
}

export default function AddressForm({ profile, onSaved }: Props) {
  const { showToast } = useToast();
  const { update, isLoading } = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetAddress: profile.streetAddress ?? "",
      streetAddressNumber: profile.streetAddressNumber ?? "",
      neighborhood: profile.neighborhood ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      country: profile.country ?? "",
      zipCode: profile.zipCode ?? "",
    },
  });

  useEffect(() => {
    reset({
      streetAddress: profile.streetAddress ?? "",
      streetAddressNumber: profile.streetAddressNumber ?? "",
      neighborhood: profile.neighborhood ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      country: profile.country ?? "",
      zipCode: profile.zipCode ?? "",
    });
  }, [profile, reset]);

  async function onSubmit(values: AddressFormValues) {
    try {
      await update(values);
      showToast({ type: "success", message: "Endereço atualizado com sucesso." });
      onSaved?.();
    } catch {
      showToast({ type: "error", message: "Não foi possível salvar o endereço." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="streetAddress">Logradouro</Label>
          <Input
            id="streetAddress"
            placeholder="Rua, Avenida..."
            {...register("streetAddress")}
            className="bg-white/80 rounded-xl"
          />
          {errors.streetAddress && (
            <p className="text-xs text-destructive">{errors.streetAddress.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="streetAddressNumber">Número</Label>
          <Input
            id="streetAddressNumber"
            placeholder="123"
            {...register("streetAddressNumber")}
            className="bg-white/80 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            {...register("neighborhood")}
            className="bg-white/80 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            {...register("city")}
            className="bg-white/80 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="SP"
            {...register("state")}
            className="bg-white/80 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            placeholder="00000-000"
            {...register("zipCode")}
            className="bg-white/80 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            placeholder="Brasil"
            {...register("country")}
            className="bg-white/80 rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !isDirty}
          className="rounded-xl px-6 text-white transition-all duration-300 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
            boxShadow: "0 8px 22px -8px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
          }}
        >
          {isLoading ? "Salvando..." : "Salvar endereço"}
        </Button>
      </div>
    </form>
  );
}
