import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import organizerEventService from "@/features/organizer/organizer-events/services/organizerEvent.service";
import type {
    EventStatusName,
    OrganizerEventListItemDTO,
} from "@/features/organizer/organizer-events/types/organizerEvent.types";
import { ORGANIZER_STATUS_ORDER } from "@/features/organizer/organizer-events/utils/eventStatus";

const DASHBOARD_PAGE_SIZE = 100;

export type StatusGroup = {
    status: EventStatusName;
    events: OrganizerEventListItemDTO[];
};

export const useOrganizerDashboard = () => {
    const [events, setEvents] = useState<OrganizerEventListItemDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        organizerEventService
            .listMyEvents(0, DASHBOARD_PAGE_SIZE, controller.signal)
            .then((data) => {
                setEvents(data.events ?? []);
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.response?.status === 401
                        ? "Sessão expirada. Faça login novamente."
                        : "Não foi possível carregar a visão geral dos eventos.";
                setError(message);
                setEvents([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, [reloadKey]);

    const groups = useMemo<StatusGroup[]>(() => {
        const byStatus = new Map<EventStatusName, OrganizerEventListItemDTO[]>();
        ORGANIZER_STATUS_ORDER.forEach((status) => byStatus.set(status, []));

        events.forEach((event) => {
            if (!event.statusName) return;
            const list = byStatus.get(event.statusName);
            if (list) list.push(event);
        });

        return ORGANIZER_STATUS_ORDER.map((status) => ({
            status,
            events: byStatus.get(status) ?? [],
        }));
    }, [events]);

    const totals = useMemo(() => {
        const result: Record<EventStatusName, number> = {
            PENDING_APPROVAL: 0,
            APPROVED: 0,
            COMPLETED: 0,
            DECLINED: 0,
            CANCELED: 0,
            POSTPONED: 0,
        };
        events.forEach((event) => {
            if (event.statusName) result[event.statusName] += 1;
        });
        return result;
    }, [events]);

    const reload = () => setReloadKey((k) => k + 1);

    return {
        events,
        groups,
        totals,
        isLoading,
        error,
        reload,
    };
};
