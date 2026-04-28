import { useEffect, useState } from "react";
import axios from "axios";
import type {
    EventDetails,
    EventPageBatchDTO,
    EventPageDTO,
    EventPageSectorDTO,
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

function mapBatchToTicket(
    batch: EventPageBatchDTO,
    sector: EventPageSectorDTO
): EventDetails["tickets"][number] {
    return {
        id: String(batch.batchID),
        name: `${sector.name} - Lote ${batch.batchNumber}`,
        description: sector.description,
        price: Number(batch.price ?? 0),
        available: batch.availableTickets ?? 0,
        maxPerPurchase: 10,
        salesEnd: "",
    };
}

function mapTickets(sectors: EventPageSectorDTO[]): EventDetails["tickets"] {
    return sectors.flatMap((sector) =>
        (sector.batches ?? []).map((batch) => mapBatchToTicket(batch, sector))
    );
}

function mapEventDetails(dto: EventPageDTO): EventDetails {
    const orderedImages = [...(dto.images ?? [])].sort(
        (a, b) => (a.ordination ?? 0) - (b.ordination ?? 0)
    );

    return {
        id: "",
        title: dto.title,
        image: buildEventImageUrl(orderedImages[0]?.s3Key),
        category: dto.category?.name ?? "Evento",
        description: dto.description ?? "",
        date: {
            start: dto.startDate,
            end: dto.endDate,
            doorsOpen: dto.salesStartDate ?? undefined,
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
        tickets: mapTickets(dto.sectors ?? []),
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
