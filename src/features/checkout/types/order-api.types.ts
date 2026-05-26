export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CANCELED"
  | "EXPIRED"
  | "REFUNDED";

export interface AppliedFeeDTO {
  feeId: number;
  name: string;
  description: string;
  feeType: "FIXED" | "PERCENTAGE";
  feeValue: number;
  scope: "PLATFORM" | "ORGANIZER" | "EVENT";
  computedAmount: number;
}

export interface QuoteItemRequest {
  batchAllotmentId: number;
  ticketTypeId: number;
}

export interface QuoteRequest {
  eventDateId: number;
  items: QuoteItemRequest[];
}

export interface QuoteItemResponse {
  batchAllotmentId: number;
  ticketTypeName: string;
  unitPrice: number;
  appliedFees: AppliedFeeDTO[];
  feesTotal: number;
  totalWithFees: number;
  availableTickets: number;
}

export interface QuoteResponse {
  eventId: number;
  eventTitle: string;
  eventDateId: number;
  currency: string;
  items: QuoteItemResponse[];
  subtotal: number;
  feesTotal: number;
  totalPrice: number;
}

export interface PlaceOrderItemRequest {
  batchAllotmentId: number;
  ticketTypeId: number;
  holderName: string;
  holderDocument: string;
  eligibilityTypeId: number | null;
  eligibilityDocumentNumber: string | null;
}

export interface PlaceOrderRequest {
  eventDateId: number;
  items: PlaceOrderItemRequest[];
}

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

export interface PlaceOrderResponse {
  orderId: number;
  status: OrderStatus;
  totalPrice: number;
  currency: string;
  expiresAt: string;
  paymentIntentId: string;
  clientSecret: string;
  publishableKey: string;
  items: OrderItemResponse[];
}

export interface EligibilityTypeDTO {
  eligibilityTypeId: number;
  name: "STUDENT" | "ELDERLY" | "DISABILITY" | "LOW_INCOME_YOUTH" | "TEACHER";
}
