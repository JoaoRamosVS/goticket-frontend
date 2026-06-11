import goTicketApi from "@/services/api";
import type {
    AdminOrderListDTO,
    AdminOrderSummaryDTO,
} from "@/features/admin/admin-pedidos/types/order.types";

function authHeaders(): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

/**
 * `GET /orders` — lista paginada de pedidos.
 * Nota: o endpoint atual exige SCOPE_ADMIN no backend para uso administrativo.
 */
const getAdminOrders = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<AdminOrderListDTO> => {
    const response = await goTicketApi.get<AdminOrderListDTO>("/orders", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /orders/{orderId}/summary` — detalhamento completo de um pedido.
 * Aceita SCOPE_ADMIN conforme `OrderController`.
 */
const getAdminOrderSummary = async (
    orderId: number | string,
    signal?: AbortSignal
): Promise<AdminOrderSummaryDTO> => {
    const response = await goTicketApi.get<AdminOrderSummaryDTO>(
        `/orders/${orderId}/summary`,
        { headers: authHeaders(), signal }
    );
    return response.data;
};

export default { getAdminOrders, getAdminOrderSummary };
