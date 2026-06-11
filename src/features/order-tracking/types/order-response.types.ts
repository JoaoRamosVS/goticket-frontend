export interface OrderSummaryItemDTO {
  orderItemId: number;
  sectorName: string;
  ticketTypeName: string;
  unitPrice: number;
  feeAmount: number;
  itemTotal: number;
  holderName: string;
  ticketId: string | null;
  qrToken: string | null;
}

export interface OrderSummaryResponse {
  orderId: number;
  status: string;
  eventId: number;
  eventTitle: string;
  eventImageS3Key: string | null;
  eventStartDate: string;
  venueName: string;
  venueCity: string;
  subtotal: number;
  feesTotal: number;
  totalPrice: number;
  currency: string;
  paidAt: string | null;
  items: OrderSummaryItemDTO[];
}

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
  qrToken: string | null;
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

export interface OrderStatusResponse {
  orderId: number;
  status: OrderStatus;
}