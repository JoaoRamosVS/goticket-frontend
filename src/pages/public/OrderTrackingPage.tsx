import { useParams, useLocation, Link } from "react-router-dom";
import type { PlaceOrderResponse } from "@/features/checkout/types/order-api.types";
import useOrder from "@/features/order-tracking/hooks/useOrder";
import useOrderPolling from "@/features/order-tracking/hooks/useOrderPolling";
import useOrderSummary from "@/features/order-tracking/hooks/useOrderSummary";
import OrderHeader from "@/features/order-tracking/components/OrderHeader";
import OrderStatusBanner from "@/features/order-tracking/components/OrderStatusBanner";
import OrderItemsList from "@/features/order-tracking/components/OrderItemsList";
import ExpirationCountdown from "@/features/order-tracking/components/ExpirationCountdown";
import StripePaymentArea from "@/features/order-tracking/components/StripePaymentArea";
import OrderSummarySidebar from "@/features/order-tracking/components/OrderSummarySidebar";
import type { OrderResponse } from "@/features/order-tracking/types/order-response.types";

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const placeOrderState = location.state as PlaceOrderResponse | null;

  const parsedOrderId = Number(orderId);

  // Se vier direto do checkout (via navigate state), usa o PlaceOrderResponse como inicial
  const initialOrder: OrderResponse | undefined = placeOrderState?.orderId
    ? {
        orderId: placeOrderState.orderId,
        status: placeOrderState.status,
        eventId: 0,
        eventDateId: 0,
        subtotal: 0,
        feesTotal: 0,
        totalPrice: placeOrderState.totalPrice,
        currency: placeOrderState.currency,
        paymentIntentId: placeOrderState.paymentIntentId,
        clientSecret: placeOrderState.clientSecret,
        publishableKey: placeOrderState.publishableKey,
        placedAt: new Date().toISOString(),
        expiresAt: placeOrderState.expiresAt,
        paidAt: null,
        items: placeOrderState.items,
      }
    : undefined;

  const { order: fetchedOrder, isLoading, error } = useOrder(parsedOrderId, initialOrder);
  const { order, isPolling } = useOrderPolling(parsedOrderId, fetchedOrder);
  const { summary, isLoading: summaryLoading } = useOrderSummary(parsedOrderId);

  if (isLoading || (!order && !error)) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 mt-32 flex justify-center">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 mt-32">
        <div className="rounded-2xl border bg-destructive/10 border-destructive/20 p-6 text-center space-y-3">
          <p className="font-semibold text-destructive">Pedido não encontrado</p>
          <p className="text-sm text-muted-foreground">
            Não foi possível encontrar este pedido.
          </p>
          <Link
            to="/"
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const clientSecret = order.clientSecret ?? placeOrderState?.clientSecret;
  const publishableKey = order.publishableKey ?? placeOrderState?.publishableKey;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div className="flex flex-col gap-6">
          <OrderStatusBanner status={order.status} />
          <OrderHeader
            orderId={order.orderId}
            status={order.status}
            totalPrice={order.totalPrice}
            currency={order.currency}
          />

          {order.status === "PENDING_PAYMENT" && (
            <div className="flex items-center gap-2">
              <ExpirationCountdown expiresAt={order.expiresAt} />
              {isPolling && (
                <span className="text-xs text-muted-foreground font-semibold">
                  Verificando status...
                </span>
              )}
            </div>
          )}

          {order.items.length > 0 && <OrderItemsList items={order.items} />}

          {clientSecret && publishableKey && order.status === "PENDING_PAYMENT" && (
            <StripePaymentArea clientSecret={clientSecret} publishableKey={publishableKey} />
          )}
        </div>

        <aside className="lg:sticky lg:top-28">
          <OrderSummarySidebar summary={summary} isLoading={summaryLoading} />
        </aside>
      </div>
    </div>
  );
}
