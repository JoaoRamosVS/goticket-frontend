import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import orderService from "@/features/admin/admin-pedidos/services/order.service";
import type { AdminOrderListItemDTO } from "@/features/admin/admin-pedidos/types/order.types";

const PAGE_SIZE = 15;

export const useAdminOrders = () => {
    const [orders, setOrders] = useState<AdminOrderListItemDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadOrders = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return orderService
                .getAdminOrders(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setOrders(data.myOrderListItemDTOList ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os pedidos.";
                    setError(message);
                    setOrders([]);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        loadOrders(page, controller.signal);
        return () => controller.abort();
    }, [page, loadOrders]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredOrders = useMemo(() => {
        if (!normalizedSearch) return orders;
        return orders.filter((order) => {
            const idMatch = String(order.orderId).includes(normalizedSearch);
            const titleMatch = order.eventTitle
                ?.toLowerCase()
                .includes(normalizedSearch);
            return idMatch || titleMatch;
        });
    }, [orders, normalizedSearch]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
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
    };
};
