import { useEffect, useState } from "react";
import orderTrackingService from "../services/order-tracking.service";
import type { OrderResponse } from "../types/order-response.types";

interface UseOrderResult {
  order: OrderResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function useOrder(orderId: number, initial?: OrderResponse): UseOrderResult {
  const [order, setOrder] = useState<OrderResponse | null>(initial ?? null);
  const [isLoading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;

    const controller = new AbortController();
    setLoading(true);

    orderTrackingService
      .getOrder(orderId, controller.signal)
      .then(setOrder)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError("Pedido não encontrado.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [orderId, initial]);

  return { order, isLoading, error };
}
