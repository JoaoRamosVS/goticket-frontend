import { buildEventImageUrl } from "@/utils/events";
import { formatCurrency, formatDate, formatTime } from "@/features/event-details/utils/helpers";
import { MapPin, Calendar } from "lucide-react";
import type { OrderSummaryItemDTO, OrderSummaryResponse } from "../types/order-response.types";

interface StackedGroup {
  sectorName: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  feeAmount: number;
  groupTotal: number;
}

function stackItems(items: OrderSummaryItemDTO[]): StackedGroup[] {
  const map = new Map<string, StackedGroup>();
  for (const item of items) {
    const key = `${item.sectorName}|${item.ticketTypeName}|${item.unitPrice}|${item.feeAmount}`;
    const existing = map.get(key);
    if (existing) {
      existing.quantity++;
      existing.groupTotal += item.itemTotal;
    } else {
      map.set(key, {
        sectorName: item.sectorName,
        ticketTypeName: item.ticketTypeName,
        quantity: 1,
        unitPrice: item.unitPrice,
        feeAmount: item.feeAmount,
        groupTotal: item.itemTotal,
      });
    }
  }
  return [...map.values()];
}

function translateTicketType(name: string): string {
  if (name === "FULL") return "INTEIRA";
  if (name === "HALF") return "MEIA ENTRADA";
  return name;
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

interface Props {
  summary: OrderSummaryResponse | null;
  isLoading: boolean;
}

export default function OrderSummarySidebar({ summary, isLoading }: Props) {
  if (isLoading) return <Skeleton />;
  if (!summary) return null;

  const imageUrl = buildEventImageUrl(summary.eventImageS3Key);
  const groups = stackItems(summary.items);

  return (
    <div className="overflow-hidden rounded-4xl border bg-background/60 backdrop-blur-md shadow-md text-sm">
      <img
        src={imageUrl}
        alt={summary.eventTitle}
        className="h-40 w-full object-cover"
      />

      <div className="p-5 space-y-4">
        <div>
          <h2 className="font-extrabold text-xl text-foreground leading-tight">
            {summary.eventTitle}
          </h2>
          <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" />
              <span>
                {formatDate(summary.eventStartDate)}, {formatTime(summary.eventStartDate)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span>{summary.venueName}, {summary.venueCity}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          {groups.map((group, i) => (
            <div key={i} className="space-y-1">
              <p className="text-sm font-extrabold text-foreground uppercase tracking-wide">
                {group.sectorName}
              </p>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {translateTicketType(group.ticketTypeName)}
                  <span className="ml-1.5 text-muted-foreground font-normal">
                    × {group.quantity}
                  </span>
                </span>
                <span className="tabular-nums font-bold text-foreground">
                  {formatCurrency(group.groupTotal)}
                </span>
              </div>
              <div className="pl-2 text-xs text-muted-foreground space-y-0.5">
                <div className="flex justify-between">
                  <span>Preço base</span>
                  <span className="tabular-nums">{formatCurrency(group.unitPrice)} /ingresso</span>
                </div>
                {group.feeAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Taxa</span>
                    <span className="tabular-nums">+ {formatCurrency(group.feeAmount)} /ingresso</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span className="font-semibold text-foreground/80">Subtotal</span>
            <span className="tabular-nums font-semibold">{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span className="font-semibold text-foreground/80">Taxas</span>
            <span className="tabular-nums">+ {formatCurrency(summary.feesTotal)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-xl pt-2 mt-2 border-t">
            <span className="text-foreground/80">Total</span>
            <span className="tabular-nums text-primary italic">{formatCurrency(summary.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
