export interface EventSectorSummary {
    sectorId: number;
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number;
    mapElementId: string | null;
    venueSectorMaxCapacity: number;
}

export interface AllotmentFull {
    allotmentId: number;
    ticketTypeId: number;
    ticketTypeName: string;
    quota: number;
    soldTickets: number;
    available: number;
    storedPrice: number | null;
    effectivePrice: number;
}

export interface TicketBatchFull {
    batchId: number;
    batchNumber: number;
    price: number;
    activationDate: string | null;
    totalTickets: number;
    soldTickets: number;
    availableTickets: number;
    allotments: AllotmentFull[];
}

export interface EventDateSectorFull {
    eventDateSectorId: number;
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number;
    mapElementId: string | null;
    totalTickets: number;
    soldTickets: number;
    availableTickets: number;
    batches: TicketBatchFull[];
}

export interface EventDateFull {
    eventDateId: number;
    startDate: string;
    endDate: string;
    statusId: number;
    statusName: string;
    dateSectors: EventDateSectorFull[];
}

export interface EventConfigureResponse {
    eventId: number;
    title: string;
    venue: { venueID: number; name: string };
    sectors: EventSectorSummary[];
    eventDates: EventDateFull[];
}

// --- request payloads ---

export interface CreateEventSectorPayload {
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number;
}

export interface CreateEventDateSectorPayload {
    eventSectorId: number;
}

export interface CreateBatchAllotmentPayload {
    ticketTypeId: number;
    quota: number;
    price?: number | null;
}

export interface CreateTicketBatchPayload {
    price: number;
    activationDate?: string | null;
    allotments: CreateBatchAllotmentPayload[];
}

// --- step metadata ---

export type ConfigureStepIndex = 0 | 1 | 2;

export const CONFIGURE_STEPS: Array<{
    id: ConfigureStepIndex;
    title: string;
    subtitle: string;
}> = [
    {
        id: 0,
        title: "Setores",
        subtitle: "Adicione os setores do espaço ao evento.",
    },
    {
        id: 1,
        title: "Datas × Setores",
        subtitle: "Vincule cada setor a uma ou mais datas do evento.",
    },
    {
        id: 2,
        title: "Lotes",
        subtitle: "Configure preços e cotas de ingressos por setor.",
    },
];
