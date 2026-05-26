import goTicketApi from "@/services/api";
import type { OrderResponse } from "../types/order-response.types";

async function getOrder(orderId: number, signal?: AbortSignal): Promise<OrderResponse> {
  const { data } = await goTicketApi.get<OrderResponse>(`/orders/${orderId}`, { signal });
  return data;
}

export default { getOrder };
