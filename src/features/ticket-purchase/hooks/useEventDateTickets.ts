import { useEffect, useState } from "react";
import axios from "axios";
import ticketPurchaseService from "@/features/ticket-purchase/services/ticket-purchase.service";
import { mapEventDateTickets } from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type { EventDateTickets } from "@/features/ticket-purchase/types/ticket-purchase.types";

type UseEventDateTicketsResult = {
    data: EventDateTickets | null;
    isLoading: boolean;
    error: string | null;
};

export default function useEventDateTickets(
    eventId?: string,
    eventDateId?: string
): UseEventDateTicketsResult {
    const [data, setData] = useState<EventDateTickets | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId || !eventDateId) {
            setData(null);
            setError("Evento ou data não informados.");
            setIsLoading(false);
            return;
        }

        const parsedDateId = Number(eventDateId);
        if (!Number.isFinite(parsedDateId)) {
            setData(null);
            setError("Data do evento inválida.");
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        ticketPurchaseService
            .getEventForPurchase(eventId, controller.signal)
            .then((dto) => {
                const mapped = mapEventDateTickets(
                    dto,
                    String(eventId),
                    parsedDateId
                );
                if (!mapped) {
                    setData(null);
                    setError("Data não encontrada para este evento.");
                    return;
                }
                setData(mapped);
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.message
                        ? err.message
                        : "Não foi possível carregar os ingressos desta data.";
                setError(message);
                setData(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [eventId, eventDateId]);

    return { data, isLoading, error };
}
