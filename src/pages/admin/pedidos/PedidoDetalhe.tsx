import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { OrderSummaryView } from "@/features/admin/admin-pedidos/components/OrderSummaryView";
import { useAdminOrderSummary } from "@/features/admin/admin-pedidos/hooks/useAdminOrderSummary";

const PedidoDetalhe = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const { summary, isLoading, error } = useAdminOrderSummary(orderId);

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/pedidos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para pedidos
                </button>
            </div>

            <AdminPageHeader
                icon={ShoppingBag}
                title={summary ? `Pedido #${summary.orderId}` : "Detalhes do pedido"}
                description={
                    summary
                        ? summary.eventTitle
                        : orderId
                          ? `Pedido ID ${orderId}`
                          : "Carregando..."
                }
            />

            <OrderSummaryView
                summary={summary}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};

export default PedidoDetalhe;
