import type { OrderStatus } from "../types/order-response.types";

const TERMINAL_STATUSES: OrderStatus[] = ["PAID", "CANCELED", "EXPIRED", "REFUNDED"];

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Aguardando pagamento";
    case "PAID":
      return "Pagamento confirmado";
    case "CANCELED":
      return "Pedido cancelado";
    case "EXPIRED":
      return "Reserva expirada";
    case "REFUNDED":
      return "Reembolsado";
  }
}
