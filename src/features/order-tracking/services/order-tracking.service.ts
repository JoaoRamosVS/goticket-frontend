import goTicketApi from "@/services/api";
import type { OrderResponse,  OrderStatusResponse,  OrderSummaryResponse } from "../types/order-response.types";

async function getOrder(orderId: number, signal?: AbortSignal): Promise<OrderResponse> {
  const { data } = await goTicketApi.get<OrderResponse>(`/orders/${orderId}`, { signal });
  return data;
}

async function getOrderStatus(orderId: number, signal?: AbortSignal): Promise<OrderStatusResponse> {
  const { data } = await goTicketApi.get<OrderStatusResponse>(`/orders/${orderId}/status`, { signal });
  return data;
}

async function getOrderSummary(orderId: number, signal?: AbortSignal): Promise<OrderSummaryResponse> {
  const { data } = await goTicketApi.get<OrderSummaryResponse>(`/orders/${orderId}/summary`, { signal });
  return data;
}

export default { getOrder, getOrderStatus, getOrderSummary };
