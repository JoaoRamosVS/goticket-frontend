import { useRef, useState } from "react";
import checkoutService from "../services/checkout.service";
import type { CheckoutFormData } from "../types/checkout-form.types";
import type { PlaceOrderResponse } from "../types/order-api.types";
import { buildPlaceOrderPayload } from "../utils/build-place-order-payload";
import { createIdempotencyKey } from "../utils/idempotency-key";

interface UsePlaceOrderResult {
  submit: (form: CheckoutFormData) => Promise<PlaceOrderResponse>;
  isSubmitting: boolean;
}

export default function usePlaceOrder(): UsePlaceOrderResult {
  // Chave criada uma vez por mount — sobrevive a re-renders e a retentativas
  const idempotencyKey = useRef<string>(createIdempotencyKey());
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async (form: CheckoutFormData): Promise<PlaceOrderResponse> => {
    setSubmitting(true);
    try {
      const payload = buildPlaceOrderPayload(form);
      return await checkoutService.placeOrder(payload, idempotencyKey.current);
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, isSubmitting };
}
