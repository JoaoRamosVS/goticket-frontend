import { Link } from "react-router-dom";
import { Calendar, MapPin, Package } from "lucide-react";
import { buildEventImageUrl } from "@/utils/events";
import { statusLabel } from "@/features/order-tracking/utils/order-status.helpers";
import { formatCurrency } from "@/features/order-tracking/utils/format-currency";
import { cn } from "@/lib/utils";
import type { MyOrderListItemDTO } from "../types/my-order.types";

interface Props {
  order: MyOrderListItemDTO;
}

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING_PAYMENT: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  REFUNDED: "bg-sky-100 text-sky-700 border-sky-200",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function OrderHistoryCard({ order }: Props) {
  const imageUrl = buildEventImageUrl(order.eventImageS3Key);
  const statusStyle = STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <Link
      to={`/pedidos/${order.orderId}`}
      className="group flex overflow-hidden rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30"
      style={{
        boxShadow: "0 4px 20px -8px rgba(0,46,71,0.10), inset 0 1px 0 0 rgba(255,255,255,0.8)",
      }}
    >
      <div className="relative w-28 shrink-0 sm:w-36">
        <img
          src={imageUrl}
          alt={order.eventTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-[#00334d] leading-snug line-clamp-2">
            {order.eventTitle}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
              statusStyle
            )}
          >
            {statusLabel(order.status)}
          </span>
        </div>

        <div className="space-y-1 text-xs text-[#5e6c87]">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" />
            <span>{formatDate(order.eventStartDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span>{order.venueName}, {order.venueCity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="size-3.5 shrink-0" />
            <span>{order.itemCount} {order.itemCount === 1 ? "ingresso" : "ingressos"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#5e6c87]">
            Pedido #{order.orderId}
          </span>
          <span className="font-extrabold text-primary tabular-nums">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
