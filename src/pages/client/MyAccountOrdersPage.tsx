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
      <div>
        <h2 className="text-xl font-bold text-[#00334d]">Meus pedidos</h2>
        <p className="text-sm text-[#5e6c87] mt-0.5">
          {data?.totalElements ?? 0} {(data?.totalElements ?? 0) === 1 ? "pedido encontrado" : "pedidos encontrados"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #e5f1ff 0%, #cce3ff 100%)",
            }}
          >
            <ShoppingBag className="size-8 text-[#2a8fd4]" />
          </div>
          <div>
            <p className="font-bold text-[#00334d]">Nenhum pedido encontrado</p>
            <p className="text-sm text-[#5e6c87] mt-1">Explore nossos eventos e adquira seus ingressos.</p>
          </div>
          <Button asChild>
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
