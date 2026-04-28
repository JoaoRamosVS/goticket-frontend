import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import clientService from "@/features/admin/admin-clients/services/client.service";
import type { ClientMinDTO } from "@/features/admin/admin-clients/types/client.types";

const PAGE_SIZE = 10;

export const useClients = () => {
    const [clients, setClients] = useState<ClientMinDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadClients = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return clientService
                .listClients(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setClients(data.clientMinDTOList ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os clientes.";
                    setError(message);
                    setClients([]);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        loadClients(page, controller.signal);
        return () => controller.abort();
    }, [page, loadClients]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredClients = useMemo(() => {
        if (!normalizedSearch) return clients;
        return clients.filter((client) => {
            const idMatch = String(client.userID).toLowerCase().includes(normalizedSearch);
            const emailMatch = client.email?.toLowerCase().includes(normalizedSearch);
            const nameMatch = client.fullName?.toLowerCase().includes(normalizedSearch);
            const cpfMatch = client.identityDocument?.toLowerCase().includes(normalizedSearch);
            return idMatch || emailMatch || nameMatch || cpfMatch;
        });
    }, [clients, normalizedSearch]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        clients,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadClients,
        filteredClients,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    };
};
