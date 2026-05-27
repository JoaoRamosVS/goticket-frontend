import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "../utils/profile.schema";
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

const SEX_LABELS: Record<number, string> = { 1: "Masculino", 2: "Feminino" };

export default function ProfileForm({ profile, onSaved }: Props) {
  const { showToast } = useToast();
  const { update, isLoading } = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: profile.fullName, sex: profile.sex },
  });

  useEffect(() => {
    reset({ fullName: profile.fullName, sex: profile.sex });
  }, [profile, reset]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      await update(values);
      showToast({ type: "success", message: "Perfil atualizado com sucesso." });
      onSaved?.();
    } catch {
      showToast({ type: "error", message: "Não foi possível salvar as alterações." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sex">Sexo</Label>
          <select
            id="sex"
            {...register("sex")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value={1}>{SEX_LABELS[1]}</option>
            <option value={2}>{SEX_LABELS[2]}</option>
          </select>
          {errors.sex && (
            <p className="text-xs text-destructive">{errors.sex.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>CPF</Label>
          <Input value={profile.identityDocument} readOnly className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
        </div>

        <div className="space-y-1.5">
          <Label>Data de nascimento</Label>
          <Input value={profile.birthDate} readOnly className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !isDirty}>
          {isLoading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
