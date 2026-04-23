import { useEffect, useState } from "react";
import axios from "axios";
import eventService from "@/services/event";
import type { EventMinDTO } from "@/types";

type UseEventsOptions = {
    page?: number;
    pageSize?: number;
};

type UseEventsResult = {
    events: EventMinDTO[];
    isLoading: boolean;
    error: string | null;
};

/**
 * Hook responsável por consumir o endpoint `GET /events` e expor os
 * eventos já tipados para a camada de apresentação. Gerencia loading,
 * erro e cancelamento em unmount/rerun.
 */
export default function useEvents({
    page = 0,
    pageSize = 20,
}: UseEventsOptions = {}): UseEventsResult {
    const [events, setEvents] = useState<EventMinDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        eventService
            .getEvents(page, pageSize, controller.signal)
            .then((data) => {
                setEvents(data.eventMinDTOList ?? []);
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.message
                        ? err.message
                        : "Não foi possível carregar os eventos.";
                setError(message);
                setEvents([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [page, pageSize]);

    return { events, isLoading, error };
}
