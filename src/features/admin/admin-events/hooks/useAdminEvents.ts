import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import eventService from "@/features/admin/admin-events/services/event.service";
import type { EventMinDTO } from "@/features/admin/admin-events/types/event.types";
import { useToast } from "@/components/ui/toast";

const PAGE_SIZE = 10;

export const useAdminEvents = () => {
    const { showToast } = useToast();
    const [events, setEvents] = useState<EventMinDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadEvents = useCallback(
        (targetPage: number, signal?: AbortSignal) => {
            setIsLoading(true);
            setError(null);

            return eventService
                .getEvents(targetPage, PAGE_SIZE, signal)
                .then((data) => {
                    setEvents(data.eventMinDTOList ?? []);
                    setTotalPages(Math.max(1, data.totalPages ?? 1));
                    setTotalElements(data.totalElements ?? 0);
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    const message =
                        axios.isAxiosError(err) && err.response?.status === 401
                            ? "Sessão expirada. Faça login novamente."
                            : "Não foi possível carregar os eventos.";
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
            const idMatch = String(event.eventID).includes(normalizedSearch);
            const titleMatch = event.title
                ?.toLowerCase()
                .includes(normalizedSearch);
            return idMatch || titleMatch;
        });
    }, [events, normalizedSearch]);

    const handleDelete = async (event: EventMinDTO) => {
        const confirmed = window.confirm(
            `Excluir permanentemente o evento "${event.title}" (ID ${event.eventID})?`
        );
        if (!confirmed) return;

        try {
            setDeletingId(event.eventID);
            await eventService.deleteEvent(event.eventID);
            await loadEvents(page);
            showToast({
                type: "success",
                message: `Evento "${event.title}" excluído com sucesso.`,
            });
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : "Não foi possível excluir o evento.";
            showToast({ type: "error", message });
        } finally {
            setDeletingId(null);
        }
    };

    const rangeStart = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const rangeEnd = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return {
        events,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        deletingId,
        loadEvents,
        filteredEvents,
        normalizedSearch,
        handleDelete,
        rangeStart,
        rangeEnd,
    };
};
