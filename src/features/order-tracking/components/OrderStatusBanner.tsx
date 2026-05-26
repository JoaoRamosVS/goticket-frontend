import { CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import type { OrderStatus } from "../types/order-response.types";

interface BannerConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  className: string;
}

const BANNER: Record<OrderStatus, BannerConfig> = {
  PENDING_PAYMENT: {
    icon: <Loader2 className="size-6 animate-spin" />,
    title: "Aguardando confirmação de pagamento",
    description:
      "Seu pedido foi criado e os ingressos estão reservados. O status será atualizado automaticamente quando o pagamento for confirmado.",
    className: "from-primary/20 to-[#2959b9]/20 border-primary/30 text-primary-foreground",
  },
  PAID: {
    icon: <CheckCircle2 className="size-6" />,
    title: "Pagamento confirmado!",
    description: "Seus ingressos foram gerados e estão disponíveis abaixo.",
    className: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-100",
  },
  CANCELED: {
    icon: <XCircle className="size-6" />,
    title: "Pedido cancelado",
    description: "Este pedido foi cancelado. Os ingressos reservados foram liberados.",
    className: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-100",
  },
  EXPIRED: {
    icon: <Clock className="size-6" />,
    title: "Reserva expirada",
    description:
      "O tempo de 10 minutos para concluir o pagamento expirou. Os ingressos foram liberados.",
    className: "from-zinc-500/20 to-zinc-600/20 border-zinc-500/30 text-zinc-300",
  },
  REFUNDED: {
    icon: <RefreshCw className="size-6" />,
    title: "Pedido reembolsado",
    description: "O valor pago foi estornado ao método de pagamento utilizado.",
    className: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-100",
  },
};

interface OrderStatusBannerProps {
  status: OrderStatus;
}

export default function OrderStatusBanner({ status }: OrderStatusBannerProps) {
  const config = BANNER[status];

  return (
    <div
      className={`rounded-2xl border bg-linear-to-r p-5 flex items-start gap-4 ${config.className}`}
    >
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div>
        <p className="font-semibold">{config.title}</p>
        <p className="text-sm opacity-80 mt-0.5">{config.description}</p>
      </div>
    </div>
  );
}
