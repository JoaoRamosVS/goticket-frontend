import type { TicketTypeName } from "@/features/event-details/types/event-details.types";

export interface HolderFormItem {
  ticketType: TicketTypeName;
  batchAllotmentId: number;
  ticketTypeId: number;
  holderName: string;
  holderDocument: string;
  eligibilityTypeId: number | null;
  eligibilityTypeName: string | null;
  eligibilityDocumentNumber: string | null;
}

export interface CheckoutFormData {
  eventDateId: number;
  holders: HolderFormItem[];
}
