import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useMyOrders from "@/features/client/hooks/useMyOrders";
import OrderHistoryCard from "@/features/client/components/OrderHistoryCard";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

export default function MyAccountOrdersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useMyOrders(page, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  const orders = data?.myOrderListItemDTOList ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden
          className="mt-0.5 block h-9 w-1 shrink-0 rounded-full"
          style={{ background: "linear-gradient(180deg, #4db8e8 0%, #1c6fb5 100%)" }}
        />
        <div>
          <h2 className="text-xl font-bold text-[#00334d]">Meus pedidos</h2>
          <p className="text-sm text-[#5e6c87] mt-0.5">
            {data?.totalElements ?? 0}{" "}
            {(data?.totalElements ?? 0) === 1 ? "pedido encontrado" : "pedidos encontrados"}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-3xl"
            style={{ background: "linear-gradient(135deg, #e5f1ff 0%, #cce3ff 100%)" }}
          >
            <ShoppingBag className="size-8 text-[#2a8fd4]" />
          </div>
          <div>
            <p className="font-bold text-[#00334d]">Nenhum pedido encontrado</p>
            <p className="text-sm text-[#5e6c87] mt-1">Explore nossos eventos e adquira seus ingressos.</p>
          </div>
          <Button
            asChild
            className="rounded-xl px-6 text-white transition-all duration-300 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
              boxShadow: "0 8px 22px -8px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
            }}
          >
            <Link to="/home">Ver eventos</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderHistoryCard key={order.orderId} order={order} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="rounded-xl border-[#c8e2f5] bg-white/70 text-[#00334d] hover:bg-white/90"
              >
                Anterior
              </Button>
              <span className="text-sm text-[#5e6c87] font-semibold">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="rounded-xl border-[#c8e2f5] bg-white/70 text-[#00334d] hover:bg-white/90"
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
