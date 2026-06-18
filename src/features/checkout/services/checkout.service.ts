import goTicketApi from "@/services/api";
import type {
  EligibilityTypeDTO,
  PlaceOrderRequest,
  PlaceOrderResponse,
  QuoteRequest,
  QuoteResponse,
} from "../types/order-api.types";

async function quoteOrder(request: QuoteRequest, signal?: AbortSignal): Promise<QuoteResponse> {
  const { data } = await goTicketApi.post<QuoteResponse>("/orders/quote", request, { signal });
  return data;
}

async function placeOrder(
  request: PlaceOrderRequest,
  idempotencyKey: string,
  queueToken?: string | null
): Promise<PlaceOrderResponse> {
  const headers: Record<string, string> = { "Idempotency-Key": idempotencyKey };
  if (queueToken) {
    headers["X-Queue-Token"] = queueToken;
  }
  const { data } = await goTicketApi.post<PlaceOrderResponse>("/orders", request, { headers });
  return data;
}

async function listEligibilityTypes(signal?: AbortSignal): Promise<EligibilityTypeDTO[]> {
  const { data } = await goTicketApi.get<EligibilityTypeDTO[]>("/eligibility-types", { signal });
  return data;
}

export default { quoteOrder, placeOrder, listEligibilityTypes };
