import { useState } from "react";
import clientService from "../services/client.service";
import type { UpdatePasswordPayload } from "../types/client-profile.types";
import { getCurrentUserId } from "@/lib/jwt";

interface UseChangePasswordResult {
  changePassword: (payload: UpdatePasswordPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function useChangePassword(): UseChangePasswordResult {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changePassword(payload: UpdatePasswordPayload): Promise<void> {
    const clientId = getCurrentUserId();
    if (!clientId) throw new Error("Usuário não autenticado.");

    setLoading(true);
    setError(null);
    try {
      await clientService.changePassword(clientId, payload);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0] ??
        "Erro ao alterar senha.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { changePassword, isLoading, error };
}
