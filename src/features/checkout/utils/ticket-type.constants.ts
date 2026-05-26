import type { TicketTypeName } from "@/features/event-details/types/event-details.types";

// Espelha TicketType.Values do backend (seed fixo: FULL=1, HALF=2, SOLIDARY=3)
export const TICKET_TYPE_ID: Record<TicketTypeName, number> = {
  FULL: 1,
  HALF: 2,
  SOLIDARY: 3,
};

export const TICKET_TYPE_LABELS: Record<TicketTypeName, string> = {
  FULL: "Inteira",
  HALF: "Meia-entrada",
  SOLIDARY: "Solidário",
};
