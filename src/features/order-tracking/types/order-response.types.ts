export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CANCELED"
  | "EXPIRED"
  | "REFUNDED";

export interface OrderItemResponse {
  orderItemId: number;
  batchAllotmentId: number;
  ticketTypeName: string;
  holderName: string;
  holderDocument: string;
  eligibilityTypeName: string | null;
  unitPrice: number;
  feeAmount: number;
  ticketId: string | null;
}

export interface OrderResponse {
  orderId: number;
  status: OrderStatus;
  eventId: number;
  eventDateId: number;
  subtotal: number;
  feesTotal: number;
  totalPrice: number;
  currency: string;
  paymentIntentId: string;
  clientSecret?: string;
  publishableKey?: string;
  placedAt: string;
  expiresAt: string;
  paidAt: string | null;
  items: OrderItemResponse[];
}
