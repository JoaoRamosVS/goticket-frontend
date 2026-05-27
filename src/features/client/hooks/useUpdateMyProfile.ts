import { useState } from "react";
import clientService from "../services/client.service";
import type { UpdateProfilePayload, UpdateAddressPayload } from "../types/client-profile.types";
import { getCurrentUserId } from "@/lib/jwt";

interface UseUpdateMyProfileResult {
  update: (payload: UpdateProfilePayload | UpdateAddressPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function useUpdateMyProfile(): UseUpdateMyProfileResult {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(payload: UpdateProfilePayload | UpdateAddressPayload): Promise<void> {
    const clientId = getCurrentUserId();
    if (!clientId) throw new Error("Usuário não autenticado.");

    setLoading(true);
    setError(null);
    try {
      await clientService.updateMyProfile(clientId, payload);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0] ??
        "Erro ao salvar alterações.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { update, isLoading, error };
}
