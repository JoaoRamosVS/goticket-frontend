export type OrderStatusName =
    | "PENDING_PAYMENT"
    | "PAID"
    | "CANCELED"
    | "EXPIRED"
    | "REFUNDED";

/** Espelha `tech.goticket.backendapi.order.dto.MyOrderListItemDTO` */
export interface AdminOrderListItemDTO {
    orderId: number;
    status: OrderStatusName;
    eventId: number;
    eventTitle: string;
    eventImageS3Key: string | null;
    eventStartDate: string;
    venueName: string | null;
    venueCity: string | null;
    itemCount: number;
    totalPrice: number;
    currency: string;
    placedAt: string;
    expiresAt: string | null;
    paidAt: string | null;
    canceledAt: string | null;
}

/** Espelha `tech.goticket.backendapi.order.dto.MyOrderListDTO` */
export interface AdminOrderListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    myOrderListItemDTOList: AdminOrderListItemDTO[];
}

/** Espelha `tech.goticket.backendapi.order.dto.OrderSummaryItemDTO` */
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

/** Espelha `tech.goticket.backendapi.order.dto.OrderSummaryResponse` */
export interface AdminOrderSummaryDTO {
    orderId: number;
    status: OrderStatusName;
    eventId: number;
    eventTitle: string;
    eventImageS3Key: string | null;
    eventStartDate: string;
    venueName: string | null;
    venueCity: string | null;
    subtotal: number;
    feesTotal: number;
    totalPrice: number;
    currency: string;
    paidAt: string | null;
    items: OrderSummaryItemDTO[];
}
