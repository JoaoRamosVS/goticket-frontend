import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, type PasswordFormValues } from "../utils/password.schema";
import useChangePassword from "../hooks/useChangePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

export default function PasswordForm() {
  const { showToast } = useToast();
  const { changePassword, isLoading } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordFormValues) {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      showToast({ type: "success", message: "Senha alterada com sucesso." });
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0] ??
        "Não foi possível alterar a senha.";
      showToast({ type: "error", message: msg });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Senha atual</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          className="bg-white/80 rounded-xl"
        />
        {errors.currentPassword && (
          <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">Nova senha</Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          className="bg-white/80 rounded-xl"
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="bg-white/80 rounded-xl"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-xl px-6 text-white transition-all duration-300 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
            boxShadow: "0 8px 22px -8px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
          }}
        >
          {isLoading ? "Alterando..." : "Alterar senha"}
        </Button>
      </div>
    </form>
  );
}
