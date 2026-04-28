import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import spaceService from "@/features/admin/admin-spaces/services/space.service";
import type { VenueMinDTO } from "@/features/admin/admin-spaces/types/space.types";

const PAGE_SIZE = 10;

export const useSpaces = () => {
    const [venues, setVenues] = useState<VenueMinDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadVenues = useCallback((targetPage: number, signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        return spaceService
            .listVenues(targetPage, PAGE_SIZE, signal)
            .then((data) => {
                setVenues(data.venueMinDTOList ?? []);
                setTotalPages(Math.max(1, data.totalPages ?? 1));
                setTotalElements(data.totalElements ?? 0);
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.response?.status === 401
                        ? "Sessão expirada. Faça login novamente."
                        : "Não foi possível carregar os espaços.";
                setError(message);
                setVenues([]);
            })
            .finally(() => {
                if (!signal?.aborted) setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadVenues(page, controller.signal);
        return () => controller.abort();
    }, [page, loadVenues]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredVenues = useMemo(() => {
        if (!normalizedSearch) return venues;
        return venues.filter((venue) => {
            const idMatch = String(venue.venueID).toLowerCase().includes(normalizedSearch);
            const nameMatch = venue.name?.toLowerCase().includes(normalizedSearch);
            const legalMatch = venue.legalName?.toLowerCase().includes(normalizedSearch);
            const cnpjMatch = venue.CNPJ?.toLowerCase().includes(normalizedSearch);
            const organizerMatch = venue.organizerName?.toLowerCase().includes(normalizedSearch);
            const cityMatch = venue.city?.toLowerCase().includes(normalizedSearch);
            return idMatch || nameMatch || legalMatch || cnpjMatch || organizerMatch || cityMatch;
        });
    }, [venues, normalizedSearch]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        venues,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        loadVenues,
        filteredVenues,
        normalizedSearch,
        rangeStart,
        rangeEnd,
    };
};
