import { useEffect, useState } from "react";
import clientService from "../services/client.service";
import type { ClientProfileDTO } from "../types/client-profile.types";

interface UseMyProfileResult {
  profile: ClientProfileDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function useMyProfile(): UseMyProfileResult {
  const [profile, setProfile] = useState<ClientProfileDTO | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    clientService
      .getMyProfile(controller.signal)
      .then(setProfile)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError("Não foi possível carregar o perfil.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [tick]);

  return { profile, isLoading, error, refetch: () => setTick((t) => t + 1) };
}
