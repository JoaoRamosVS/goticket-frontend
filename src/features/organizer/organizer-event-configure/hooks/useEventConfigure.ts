import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import eventConfigureService from "@/features/organizer/organizer-event-configure/services/eventConfigure.service";
import {
    CONFIGURE_STEPS,
    type ConfigureStepIndex,
    type CreateTicketBatchPayload,
    type EventConfigureResponse,
} from "@/features/organizer/organizer-event-configure/types/eventConfigure.types";
import type { VenueSectorDTO } from "@/features/admin/admin-venues/types/venue.types";

export const useEventConfigure = (eventId: number) => {
    const [event, setEvent] = useState<EventConfigureResponse | null>(null);
    const [venueSectors, setVenueSectors] = useState<VenueSectorDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [venueSectorsLoading, setVenueSectorsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<ConfigureStepIndex>(0);
    const [maxStepReached, setMaxStepReached] = useState<ConfigureStepIndex>(0);

    const fetchEvent = useCallback(
        async (signal?: AbortSignal) => {
            try {
                const data = await eventConfigureService.getEventDetails(eventId, signal);
                setEvent(data);
                return data;
            } catch (err: unknown) {
                if (axios.isCancel(err)) return null;
                setError("Não foi possível carregar os dados do evento.");
                return null;
            }
        },
        [eventId]
    );

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        fetchEvent(controller.signal).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [fetchEvent]);

    useEffect(() => {
        if (!event) return;
        const venueId = event.venue.venueId;
        const controller = new AbortController();
        setVenueSectorsLoading(true);
        eventConfigureService
            .listVenueSectors(venueId, controller.signal)
            .then((data) => setVenueSectors(data))
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setVenueSectors([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setVenueSectorsLoading(false);
            });
        return () => controller.abort();
    }, [event?.venue.venueId]);

    const refresh = useCallback(async () => {
        const data = await fetchEvent();
        if (data) setEvent(data);
    }, [fetchEvent]);

    const addSector = useCallback(
        async (venueSector: VenueSectorDTO) => {
            if (!event) return;
            await eventConfigureService.createEventSector(event.eventId, {
                name: venueSector.name,
                description: venueSector.description,
                hasNumberedSeats: false,
                venueSectorId: venueSector.sectorID,
            });
            await refresh();
        },
        [event, refresh]
    );

    const removeSector = useCallback(
        async (sectorId: number) => {
            if (!event) return;
            await eventConfigureService.deleteEventSector(event.eventId, sectorId);
            await refresh();
        },
        [event, refresh]
    );

    const linkDateSector = useCallback(
        async (eventDateId: number, eventSectorId: number) => {
            if (!event) return;
            await eventConfigureService.linkDateSector(event.eventId, eventDateId, {
                eventSectorId,
            });
            await refresh();
        },
        [event, refresh]
    );

    const unlinkDateSector = useCallback(
        async (eventDateId: number, eventDateSectorId: number) => {
            if (!event) return;
            await eventConfigureService.unlinkDateSector(
                event.eventId,
                eventDateId,
                eventDateSectorId
            );
            await refresh();
        },
        [event, refresh]
    );

    const createBatch = useCallback(
        async (eventDateSectorId: number, payload: CreateTicketBatchPayload) => {
            if (!event) return;
            await eventConfigureService.createBatch(
                event.eventId,
                eventDateSectorId,
                payload
            );
            await refresh();
        },
        [event, refresh]
    );

    const deleteBatch = useCallback(
        async (batchId: number) => {
            if (!event) return;
            await eventConfigureService.deleteBatch(event.eventId, batchId);
            await refresh();
        },
        [event, refresh]
    );

    const goToStep = useCallback(
        (target: ConfigureStepIndex) => {
            if (target > maxStepReached) return;
            setStep(target);
            setError(null);
        },
        [maxStepReached]
    );

    const goBack = useCallback(() => {
        setStep((prev) => (prev > 0 ? ((prev - 1) as ConfigureStepIndex) : prev));
        setError(null);
    }, []);

    const goNext = useCallback(() => {
        if (step === 2) return;
        const next = (step + 1) as ConfigureStepIndex;
        setStep(next);
        setMaxStepReached((prev) => (next > prev ? next : prev));
        setError(null);
    }, [step]);

    return {
        event,
        venueSectors,
        loading,
        venueSectorsLoading,
        error,
        step,
        maxStepReached,
        steps: CONFIGURE_STEPS,
        stepMeta: CONFIGURE_STEPS[step],
        addSector,
        removeSector,
        linkDateSector,
        unlinkDateSector,
        createBatch,
        deleteBatch,
        goToStep,
        goBack,
        goNext,
    };
};
