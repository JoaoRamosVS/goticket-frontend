import { CheckCircle2, Clock, XCircle, RefreshCw, Loader2 } from "lucide-react";
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
    className: "from-primary to-[#2959b9] border-primary/10 text-white font-semibold",
  },
  PAID: {
    icon: <CheckCircle2 className="size-12" strokeWidth={2.5} />,
    title: "Pagamento confirmado!",
    description: "Seus ingressos foram gerados e estão disponíveis abaixo.",
    className: "from-emerald-500 to-emerald-700 text-white font-semibold",
  },
  CANCELED: {
    icon: <XCircle className="size-12" strokeWidth={2.5} />,
    title: "Pedido cancelado",
    description: "Este pedido foi cancelado. Os ingressos reservados foram liberados.",
    className: "from-red-400 to-red-700 border-red-500/30 text-white font-semibold",
  },
  EXPIRED: {
    icon: <Clock className="size-12" strokeWidth={2.5} />,
    title: "Reserva expirada",
    description:
      "O tempo de 10 minutos para concluir o pagamento expirou. Os ingressos foram liberados.",
    className: "from-zinc-500 to-zinc-700 border-zinc-500/30 text-white font-semibold",
  },
  REFUNDED: {
    icon: <RefreshCw className="size-12" strokeWidth={2.5} />,
    title: "Pedido reembolsado",
    description: "O valor pago foi estornado ao método de pagamento utilizado.",
    className: "from-amber-500 to-amber-600 border-amber-500/30 text-white font-semibold",
  },
};

interface OrderStatusBannerProps {
  status: OrderStatus;
}

export default function OrderStatusBanner({ status }: OrderStatusBannerProps) {
  const config = BANNER[status];

  return (
    <div
      className={`rounded-4xl shadow-2xl bg-linear-to-b px-8 py-6 flex items-start gap-4 ${config.className}`}
    >
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div>
        <p className="font-extrabold text-3xl tracking-wider">{config.title}</p>
        <p className="text-sm opacity-80 mt-4 font-normal">{config.description}</p>
      </div>
    </div>
  );
}
