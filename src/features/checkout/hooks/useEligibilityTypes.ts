import { useEffect, useState } from "react";
import checkoutService from "../services/checkout.service";
import type { EligibilityTypeDTO } from "../types/order-api.types";

interface UseEligibilityTypesParams {
  enabled: boolean;
}

interface UseEligibilityTypesResult {
  eligibilityTypes: EligibilityTypeDTO[];
  isLoading: boolean;
}

export default function useEligibilityTypes({ enabled }: UseEligibilityTypesParams): UseEligibilityTypesResult {
  const [eligibilityTypes, setEligibilityTypes] = useState<EligibilityTypeDTO[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    setLoading(true);

    checkoutService
      .listEligibilityTypes(controller.signal)
      .then(setEligibilityTypes)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          console.error("Falha ao carregar tipos de elegibilidade", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [enabled]);

  return { eligibilityTypes, isLoading };
}
