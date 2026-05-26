import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/features/event-details/utils/helpers";
import type { QuoteResponse } from "../types/order-api.types";

interface QuoteSummaryCardProps {
  quote: QuoteResponse | null;
  isLoading: boolean;
  sectorName: string;
}

export default function QuoteSummaryCard({ quote, isLoading, sectorName }: QuoteSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 w-32 rounded-md bg-muted/50" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 rounded-md bg-muted/50" />
          <div className="h-4 w-3/4 rounded-md bg-muted/50" />
          <div className="h-px bg-border my-2" />
          <div className="h-5 rounded-md bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  if (!quote) return null;

  return (
    <Card className="border bg-background/60 backdrop-blur-md shadow-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Resumo do pedido</CardTitle>
        {sectorName && (
          <p className="text-xs text-muted-foreground">{sectorName}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {quote.items.map((item) => (
          <div key={item.batchAllotmentId} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{item.ticketTypeName}</span>
              <span className="tabular-nums">{formatCurrency(item.unitPrice)}</span>
            </div>
            {item.appliedFees.map((fee) => (
              <div key={fee.feeId} className="flex justify-between text-xs text-muted-foreground pl-2">
                <span>{fee.name}</span>
                <span className="tabular-nums">+ {formatCurrency(fee.computedAmount)}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxas</span>
            <span className="tabular-nums">+ {formatCurrency(quote.feesTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="tabular-nums text-primary">{formatCurrency(quote.totalPrice)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
