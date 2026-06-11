import { useEffect, useState } from "react";
import axios from "axios";
import orderService from "@/features/admin/admin-pedidos/services/order.service";
import type { AdminOrderSummaryDTO } from "@/features/admin/admin-pedidos/types/order.types";

export const useAdminOrderSummary = (orderId: string | undefined) => {
    const [summary, setSummary] = useState<AdminOrderSummaryDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        orderService
            .getAdminOrderSummary(orderId, controller.signal)
            .then(setSummary)
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.response?.status === 404
                        ? "Pedido não encontrado."
                        : "Não foi possível carregar o pedido.";
                setError(message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [orderId]);

    return { summary, isLoading, error };
};
