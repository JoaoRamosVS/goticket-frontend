import { useEffect, useState } from "react";
import orderTrackingService from "../services/order-tracking.service";
import type { OrderSummaryResponse } from "../types/order-response.types";

interface UseOrderSummaryResult {
  summary: OrderSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function useOrderSummary(orderId: number): UseOrderSummaryResult {
  const [summary, setSummary] = useState<OrderSummaryResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    orderTrackingService
      .getOrderSummary(orderId, controller.signal)
      .then(setSummary)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError("Não foi possível carregar o resumo do pedido.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [orderId]);

  return { summary, isLoading, error };
}
