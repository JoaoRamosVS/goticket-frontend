import type { OrderStatus } from "@/features/order-tracking/types/order-response.types";

export interface MyOrderListItemDTO {
  orderId: number;
  status: OrderStatus;
  eventId: number;
  eventTitle: string;
  eventImageS3Key: string | null;
  eventStartDate: string;
  venueName: string;
  venueCity: string;
  itemCount: number;
  totalPrice: number;
  currency: string;
  placedAt: string;
  expiresAt: string | null;
  paidAt: string | null;
  canceledAt: string | null;
}

export interface MyOrderListDTO {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  myOrderListItemDTOList: MyOrderListItemDTO[];
}
