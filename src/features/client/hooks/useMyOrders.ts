import { useEffect, useState } from "react";
import clientOrdersService from "../services/client-orders.service";
import type { MyOrderListDTO } from "../types/my-order.types";

interface UseMyOrdersResult {
  data: MyOrderListDTO | null;
  isLoading: boolean;
  error: string | null;
}

export default function useMyOrders(page: number, pageSize: number): UseMyOrdersResult {
  const [data, setData] = useState<MyOrderListDTO | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    clientOrdersService
      .listMyOrders(page, pageSize, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError("Não foi possível carregar seus pedidos.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page, pageSize]);

  return { data, isLoading, error };
}
