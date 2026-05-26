import { Ticket } from "lucide-react";
import { formatCurrency } from "../utils/format-currency";
import type { OrderItemResponse } from "../types/order-response.types";
import { ELIGIBILITY_LABELS } from "@/features/checkout/utils/eligibility.constants";

interface OrderItemsListProps {
  items: OrderItemResponse[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">Ingressos</h2>
      {items.map((item) => (
        <div
          key={item.orderItemId}
          className="rounded-2xl border bg-background/60 backdrop-blur-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-primary/10 p-2 shrink-0">
              <Ticket className="size-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{item.holderName}</p>
              <p className="text-xs text-muted-foreground">
                {item.ticketTypeName}
                {item.eligibilityTypeName
                  ? ` · ${ELIGIBILITY_LABELS[item.eligibilityTypeName] ?? item.eligibilityTypeName}`
                  : ""}
              </p>
              {item.ticketId && (
                <p className="text-xs font-mono text-muted-foreground mt-0.5 break-all">
                  {item.ticketId}
                </p>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold tabular-nums text-foreground">
              {formatCurrency(item.unitPrice + item.feeAmount)}
            </p>
            {item.feeAmount > 0 && (
              <p className="text-xs text-muted-foreground tabular-nums">
                incl. {formatCurrency(item.feeAmount)} taxa
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
