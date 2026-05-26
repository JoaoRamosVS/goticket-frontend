import type {
    EventPageAllotmentDTO,
    EventPageAllotmentsByType,
    EventPageDateSectorDTO,
    EventPageDTO,
    TicketTypeName,
} from "@/features/event-details/types/event-details.types";
import { buildEventImageUrl } from "@/utils/events";
import type {
    EventDateSectorOption,
    EventDateTickets,
    SelectedTicketLine,
    SelectionTotals,
    TicketTypeOption,
} from "@/features/ticket-purchase/types/ticket-purchase.types";

export const TICKET_TYPE_ORDER: TicketTypeName[] = ["FULL", "HALF", "SOLIDARY"];

export const MAX_TICKETS_PER_TYPE = 10;

const TICKET_TYPE_LABELS: Record<TicketTypeName, string> = {
    FULL: "Inteira",
    HALF: "Meia entrada",
    SOLIDARY: "Solidária",
};

const TICKET_TYPE_DESCRIPTIONS: Record<TicketTypeName, string> = {
    FULL: "Valor cheio do ingresso, sem benefício aplicado.",
    HALF: "Para estudantes, idosos, PCD e demais públicos previstos por lei.",
    SOLIDARY: "Doe um item ou colabore com a causa apoiada por este evento.",
};

export function ticketTypeLabel(type: TicketTypeName): string {
    return TICKET_TYPE_LABELS[type];
}

export function ticketTypeDescription(type: TicketTypeName): string {
    return TICKET_TYPE_DESCRIPTIONS[type];
}

function pickStartingPriceForSector(
    allotments: EventPageAllotmentsByType
): number | null {
    const prices: number[] = [];
    for (const allotment of Object.values(allotments ?? {})) {
        if (!allotment) continue;
        if ((allotment.availableTickets ?? 0) <= 0) continue;
        const price = Number(allotment.price);
        if (Number.isFinite(price)) prices.push(price);
    }
    if (prices.length === 0) return null;
    return Math.min(...prices);
}

function mapSector(sector: EventPageDateSectorDTO): EventDateSectorOption {
    return {
        eventDateSectorId: sector.eventDateSectorId,
        name: sector.name,
        description: sector.description ?? "",
        hasNumberedSeats: sector.hasNumberedSeats,
        mapElementId: sector.mapElementId ?? null,
        totalTickets: sector.totalTickets ?? 0,
        availableTickets: sector.availableTickets ?? 0,
        currentAllotments: sector.currentAllotments ?? {},
        startingPrice: pickStartingPriceForSector(
            sector.currentAllotments ?? {}
        ),
    };
}

export function mapEventDateTickets(
    dto: EventPageDTO,
    eventId: string,
    eventDateId: number
): EventDateTickets | null {
    const date = dto.dates?.find((d) => d.eventDateId === eventDateId);
    if (!date) return null;

    const orderedImages = [...(dto.images ?? [])].sort(
        (a, b) => (a.ordination ?? 0) - (b.ordination ?? 0)
    );

    const sectors = (date.dateSectors ?? [])
        .map(mapSector)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    return {
        eventId,
        eventTitle: dto.title,
        eventImage: buildEventImageUrl(orderedImages[0]?.s3Key),
        venueId: dto.venue?.venueId ?? null,
        venueName: dto.venue?.name ?? "Local a confirmar",
        venueCity: dto.venue?.city ?? "",
        venueState: dto.venue?.state ?? "",
        eventDateId: date.eventDateId,
        startDate: date.startDate,
        endDate: date.endDate,
        statusId: date.statusId ?? null,
        sectors,
    };
}

export function isSectorAvailable(sector: EventDateSectorOption): boolean {
    if (sector.availableTickets <= 0) return false;
    return availableTicketTypeOptions(sector).length > 0;
}

export function availableTicketTypeOptions(
    sector: EventDateSectorOption
): TicketTypeOption[] {
    const options: TicketTypeOption[] = [];
    for (const type of TICKET_TYPE_ORDER) {
        const allotment = sector.currentAllotments[type];
        if (!allotment) continue;
        if ((allotment.availableTickets ?? 0) <= 0) continue;
        options.push({
            type,
            label: ticketTypeLabel(type),
            allotment,
        });
    }
    return options;
}

export function maxQuantityFor(allotment: EventPageAllotmentDTO): number {
    return Math.max(
        0,
        Math.min(allotment.availableTickets ?? 0, MAX_TICKETS_PER_TYPE)
    );
}

export function emptyQuantities(): Record<TicketTypeName, number> {
    return { FULL: 0, HALF: 0, SOLIDARY: 0 };
}

export function computeTotals(
    sector: EventDateSectorOption | null,
    quantities: Record<TicketTypeName, number>
): SelectionTotals {
    const lines: SelectedTicketLine[] = [];
    if (!sector) {
        return { totalQuantity: 0, totalAmount: 0, lines };
    }

    let totalQuantity = 0;
    let totalAmount = 0;

    for (const type of TICKET_TYPE_ORDER) {
        const quantity = quantities[type] ?? 0;
        if (quantity <= 0) continue;
        const allotment = sector.currentAllotments[type];
        if (!allotment) continue;
        const unitPrice = Number(allotment.price) || 0;
        totalQuantity += quantity;
        totalAmount += unitPrice * quantity;
        lines.push({
            type,
            label: ticketTypeLabel(type),
            quantity,
            unitPrice,
            allotmentId: allotment.allotmentId,
            batchNumber: allotment.batchNumber,
        });
    }

    return { totalQuantity, totalAmount, lines };
}
