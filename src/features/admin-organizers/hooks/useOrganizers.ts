import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import organizerService from "@/features/admin-organizers/services/organizer.service";
import type { OrganizerMinDTO } from "@/features/admin-organizers/types/organizer.types";

const PAGE_SIZE = 10;

export const useOrganizers = () => {
    const [organizers, setOrganizers] = useState<OrganizerMinDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadOrganizers = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return organizerService
                .listOrganizers(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setOrganizers(data.organizerMinDTOList ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os organizadores.";
                    setError(message);
                    setOrganizers([]);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        loadOrganizers(page, controller.signal);
        return () => controller.abort();
    }, [page, loadOrganizers]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredOrganizers = useMemo(() => {
        if (!normalizedSearch) return organizers;
        return organizers.filter((organizer) => {
            const idMatch = String(organizer.userID).toLowerCase().includes(normalizedSearch);
            const emailMatch = organizer.email?.toLowerCase().includes(normalizedSearch);
            const nameMatch = organizer.organizerName?.toLowerCase().includes(normalizedSearch);
            const legalMatch = organizer.legalName?.toLowerCase().includes(normalizedSearch);
            const cnpjMatch = organizer.CNPJ?.toLowerCase().includes(normalizedSearch);
            return idMatch || emailMatch || nameMatch || legalMatch || cnpjMatch;
        });
    }, [organizers, normalizedSearch]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        organizers,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadOrganizers,
        filteredOrganizers,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    };
};
