import type { SelectedTicketLine } from "@/features/ticket-purchase/types/ticket-purchase.types";

export interface CheckoutNavigationState {
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDateId: number;
  startDate: string;
  venueName: string;
  venueCity: string;
  sectorName: string;
  lines: SelectedTicketLine[];
}
