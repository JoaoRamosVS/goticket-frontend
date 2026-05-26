import { formatCurrency } from "../utils/format-currency";
import type { OrderStatus } from "../types/order-response.types";

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: {
    label: "Aguardando pagamento",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  PAID: {
    label: "Pago",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  EXPIRED: {
    label: "Expirado",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  REFUNDED: {
    label: "Reembolsado",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

interface OrderHeaderProps {
  orderId: number;
  status: OrderStatus;
  totalPrice: number;
  currency: string;
}

export default function OrderHeader({ orderId, status, totalPrice, currency }: OrderHeaderProps) {
  const badge = STATUS_BADGE[status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="rounded-full border border-foreground/5 shadow-sm bg-white/50 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Pedido
        </p>
        <h1 className="text-3xl font-extrabold text-foreground">#{orderId}</h1>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-foreground/5 shadow-sm bg-white/50 p-6">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.className}`}
        >
          {badge.label}
        </span>
        <span className="text-3xl font-extrabold tabular-nums text-foreground">
          {formatCurrency(totalPrice, currency)}
        </span>
      </div>
    </div>
  );
}
