import type { SelectedTicketLine } from "@/features/ticket-purchase/types/ticket-purchase.types";
import type { HolderFormItem } from "../types/checkout-form.types";
import { TICKET_TYPE_ID } from "./ticket-type.constants";

export function expandSelection(lines: SelectedTicketLine[]): HolderFormItem[] {
  return lines.flatMap((line) =>
    Array.from({ length: line.quantity }, () => ({
      ticketType: line.type,
      batchAllotmentId: line.allotmentId,
      ticketTypeId: TICKET_TYPE_ID[line.type],
      holderName: "",
      holderDocument: "",
      eligibilityTypeId: null,
      eligibilityTypeName: null,
      eligibilityDocumentNumber: null,
    }))
  );
}
