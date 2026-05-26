import type { CheckoutFormData } from "../types/checkout-form.types";
import type { PlaceOrderRequest } from "../types/order-api.types";

export function buildPlaceOrderPayload(form: CheckoutFormData): PlaceOrderRequest {
  return {
    eventDateId: form.eventDateId,
    items: form.holders.map((h) => ({
      batchAllotmentId: h.batchAllotmentId,
      ticketTypeId: h.ticketTypeId,
      holderName: h.holderName.trim(),
      holderDocument: h.holderDocument.replace(/\D/g, ""),
      eligibilityTypeId: h.ticketType === "HALF" ? h.eligibilityTypeId : null,
      eligibilityDocumentNumber:
        h.ticketType === "HALF" ? (h.eligibilityDocumentNumber ?? null) : null,
    })),
  };
}
