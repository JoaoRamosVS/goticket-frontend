import { useEffect, useRef, useState } from "react";
import orderTrackingService from "../services/order-tracking.service";
import type { OrderResponse } from "../types/order-response.types";
import { isTerminal } from "../utils/order-status.helpers";

const POLL_INTERVAL_MS = 3000;

export default function useOrderPolling(orderId: number, initial: OrderResponse | null) {
  // Estado inicializado apenas uma vez — `initial` é passado como seed inicial
  const [order, setOrder] = useState<OrderResponse | null>(initial);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (!initializedRef.current && initial !== null) {
      initializedRef.current = true;
      setOrder(initial);
    }
  }, [initial]);

  useEffect(() => {
    if (order && isTerminal(order.status)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(async () => {
      try {
        const { status } = await orderTrackingService.getOrderStatus(orderId);
        setOrder((prev) => (prev ? { ...prev, status } : prev));
        if (isTerminal(status)) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      } catch {
        // mantém estado atual em caso de falha transitória
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId, order, order?.status]);

  const isPolling = order !== null && !isTerminal(order.status);

  return { order, isPolling };
}
