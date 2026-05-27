import { useEffect, useState } from "react";
import axios from "axios";
import type {
    EventDateSummary,
    EventDetails,
    EventPageDateDTO,
    EventPageDTO,
} from "@/features/event-details/types/event-details.types";
import eventDetailsService from "@/features/event-details/services/event-details.service";
import { buildEventImageUrl } from "@/utils/events";

type UseEventDetailsResult = {
    event: EventDetails | null;
    isLoading: boolean;
    error: string | null;
};

function mapStatus(statusId?: number): EventDetails["status"] {
    if (statusId === 2) return "available";
    if (statusId === 3) return "sold_out";
    if (statusId === 1) return "coming_soon";
    return "cancelled";
}

function mapVenueAddress(venue: EventPageDTO["venue"]): string {
    if (!venue) return "";
    return [venue.streetAddress, venue.streetAddressNumber, venue.neighborhood]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(", ");
}

function pickStartingPrice(date: EventPageDateDTO): number | null {
    const prices: number[] = [];
    for (const sector of date.dateSectors ?? []) {
        for (const allotment of Object.values(sector.currentAllotments ?? {})) {
            if (!allotment) continue;
            if ((allotment.availableTickets ?? 0) <= 0) continue;
            const price = Number(allotment.price);
            if (Number.isFinite(price)) prices.push(price);
        }
    }
    if (prices.length === 0) return null;
    return Math.min(...prices);
}

function mapDateSummary(date: EventPageDateDTO): EventDateSummary {
    const totals = (date.dateSectors ?? []).reduce(
        (acc, sector) => {
            acc.total += sector.totalTickets ?? 0;
            acc.available += sector.availableTickets ?? 0;
            return acc;
        },
        { total: 0, available: 0 }
    );

    return {
        eventDateId: date.eventDateId,
        start: date.startDate,
        end: date.endDate,
        statusId: date.statusId ?? null,
        totalTickets: totals.total,
        availableTickets: totals.available,
        startingPrice: pickStartingPrice(date),
    };
}

function mapEventDetails(dto: EventPageDTO): EventDetails {
    const orderedImages = [...(dto.images ?? [])].sort(
        (a, b) => (a.ordination ?? 0) - (b.ordination ?? 0)
    );

    const dates = [...(dto.dates ?? [])]
        .sort(
            (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
        )
        .map(mapDateSummary);

    return {
        id: "",
        title: dto.title,
        image: buildEventImageUrl(orderedImages[0]?.s3Key),
        category: dto.category?.name ?? "Evento",
        description: dto.description ?? "",
        date: {
            start: dto.startDate,
            end: dto.endDate,
        },
        venue: {
            name: dto.venue?.name ?? "Local a confirmar",
            address: mapVenueAddress(dto.venue),
            city: dto.venue?.city ?? "",
            state: dto.venue?.state ?? "",
            zipCode: dto.venue?.zipCode ?? "",
        },
        organizer: {
            name: dto.organizer?.legalName ?? "Organizador",
            avatar:
                "https://ui-avatars.com/api/?name=Go+Ticket&background=57c5f4&color=fff&size=128",
            description: dto.organizer?.cnpj
                ? `CNPJ: ${dto.organizer.cnpj}`
                : "",
            totalEvents: 0,
            followers: 0,
            rating: 0,
        },
        dates,
        policies: [],
        lineup: [],
        tags: [],
        ageRating:
            dto.ageRestriction === 0 ? "Livre" : `${dto.ageRestriction}+`,
        status: mapStatus(dto.statusId),
    };
}

export default function useEventDetails(
    eventId?: string
): UseEventDetailsResult {
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) {
            setEvent(null);
            setError("Evento não encontrado.");
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        setIsLoading(true);
        setError(null);

        eventDetailsService
            .getEventById(eventId, controller.signal)
            .then((data) => {
                setEvent({ ...mapEventDetails(data), id: String(eventId) });
            })
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                const message =
                    axios.isAxiosError(err) && err.message
                        ? err.message
                        : "Não foi possível carregar o evento.";
                setError(message);
                setEvent(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [eventId]);

    return { event, isLoading, error };
}
