import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import organizerEventService from "@/features/organizer/organizer-events/services/organizerEvent.service";
import type {
    OrganizerEventListItemDTO,
} from "@/features/organizer/organizer-events/types/organizerEvent.types";

const PAGE_SIZE = 20;

export const useMyEvents = () => {
    const [events, setEvents] = useState<OrganizerEventListItemDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");

    const loadEvents = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return organizerEventService
                .listMyEvents(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setEvents(data.events ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os seus eventos.";
                    setError(message);
                    setEvents([]);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        loadEvents(page, controller.signal);
        return () => controller.abort();
    }, [page, loadEvents]);

    const normalizedSearch = searchInput.trim().toLowerCase();

    const filteredEvents = useMemo(() => {
        if (!normalizedSearch) return events;
        return events.filter((event) => {
            const idMatch = String(event.eventId).includes(normalizedSearch);
            const titleMatch = event.title
                ?.toLowerCase()
                .includes(normalizedSearch);
            return idMatch || titleMatch;
        });
    }, [events, normalizedSearch]);

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        events,
        filteredEvents,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        normalizedSearch,
        rangeStart,
        rangeEnd,
        loadEvents,
    };
};
