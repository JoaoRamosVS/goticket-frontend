import { Calendar, MapPin } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/features/event-details/utils/helpers";
import type { QuoteResponse } from "../types/order-api.types";
import type { CheckoutNavigationState } from "../types/checkout-state.types";

interface QuoteSummaryCardProps {
  quote: QuoteResponse | null;
  isLoading: boolean;
  selection: CheckoutNavigationState | null;
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-4xl border bg-background/60 backdrop-blur-md shadow-md animate-pulse">
      <div className="h-40 bg-muted/50" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded-md bg-muted/50" />
        <div className="h-4 w-1/2 rounded-md bg-muted/50" />
        <div className="h-px bg-border my-2" />
        <div className="h-4 rounded-md bg-muted/50" />
        <div className="h-4 w-3/4 rounded-md bg-muted/50" />
        <div className="h-px bg-border my-2" />
        <div className="h-5 rounded-md bg-muted/50" />
      </div>
    </div>
  );
}

export default function QuoteSummaryCard({ quote, isLoading, selection }: QuoteSummaryCardProps) {
  if (isLoading || !selection) return <Skeleton />;
  if (!quote) return null;

  return (
    <div className="overflow-hidden rounded-4xl border bg-background/60 backdrop-blur-md shadow-md text-sm">
      <img
        src={selection.eventImage}
        alt={selection.eventTitle}
        className="h-40 w-full object-cover"
      />

      <div className="p-5 space-y-4">
        <div>
          <h2 className="font-extrabold text-base text-foreground leading-tight">
            {selection.eventTitle}
          </h2>
          <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                {formatDate(selection.startDate)}, {formatTime(selection.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span>{selection.venueName}, {selection.venueCity}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          {selection.lines.map((line) => {
            const quoteItem = quote.items.find((i) => i.batchAllotmentId === line.allotmentId);
            const feesTotal = quoteItem ? quoteItem.feesTotal : 0;
            const groupTotal = (line.unitPrice + feesTotal) * line.quantity;

            return (
              <div key={line.allotmentId} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {selection.sectorName}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-foreground">
                    {line.label}
                    <span className="ml-1.5 text-muted-foreground font-normal">
                      × {line.quantity}
                    </span>
                  </span>
                  <span className="tabular-nums font-bold text-foreground">
                    {formatCurrency(groupTotal)}
                  </span>
                </div>
                <div className="pl-2 text-xs text-muted-foreground space-y-0.5">
                  <div className="flex justify-between">
                    <span>Preço base</span>
                    <span className="tabular-nums">{formatCurrency(line.unitPrice)} /ingresso</span>
                  </div>
                  {quoteItem && quoteItem.appliedFees.map((fee) => (
                    <div key={fee.feeId} className="flex justify-between">
                      <span>{fee.name}</span>
                      <span className="tabular-nums">+ {formatCurrency(fee.computedAmount)} /ingresso</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span className="font-semibold text-foreground/80">Subtotal</span>
            <span className="tabular-nums font-semibold">{formatCurrency(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="font-semibold text-foreground/80">Taxas</span>
            <span className="tabular-nums">+ {formatCurrency(quote.feesTotal)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-xl pt-2 mt-2 border-t">
            <span className="text-foreground/80">Total</span>
            <span className="tabular-nums text-primary italic">{formatCurrency(quote.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
