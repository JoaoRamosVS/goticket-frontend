import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { OrdersTable } from "@/features/admin/admin-pedidos/components/OrdersTable";
import { useAdminOrders } from "@/features/admin/admin-pedidos/hooks/useAdminOrders";

const PedidosList = () => {
    const navigate = useNavigate();
    const {
        orders,
        filteredOrders,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        normalizedSearch,
        loadOrders,
        rangeStart,
        rangeEnd,
    } = useAdminOrders();

    const handleView = (orderId: number) => {
        navigate(`/admin/pedidos/${orderId}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={ShoppingBag}
                title="Pedidos"
                description="Consulte e acompanhe os pedidos realizados na plataforma."
            />

            <OrdersTable
                orders={orders}
                filteredOrders={filteredOrders}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                isLoading={isLoading}
                error={error}
                searchInput={searchInput}
                normalizedSearch={normalizedSearch}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onSearchInputChange={setSearchInput}
                onReload={() => loadOrders(page)}
                onView={handleView}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            />
        </div>
    );
};

export default PedidosList;
