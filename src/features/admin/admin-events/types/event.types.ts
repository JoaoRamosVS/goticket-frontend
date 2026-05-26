export interface EventMinDTO {
    eventID: number;
    title: string;
    startDate: string;
    statusId: number | null;
    categoryId: number | null;
    categoryName: string | null;
    venueName: string | null;
    venueCity: string | null;
    venueState: string | null;
    startingPrice: number | string | null;
    imageKeys: string[] | null;
}

export interface EventMinListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    eventMinDTOList: EventMinDTO[];
}

export type EventVisibilityValue = "PUBLIC" | "PRIVATE";

export type EventStatusName =
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "COMPLETED"
    | "DECLINED"
    | "CANCELED"
    | "POSTPONED";

export interface EventImageDTO {
    eventImageID?: number;
    s3Key: string;
    ordination?: number;
}

/**
 * Item do JSON `metadata` em `PUT /events/{eventId}/images` (multipart).
 * Espelha `tech.goticket.backendapi.event.dto.EventImageOrderItemDTO`.
 */
export interface EventImageOrderItemDTO {
    type: "existing" | "new";
    s3Key?: string | null;
    fileIndex?: number | null;
}

/**
 * Visão completa do evento para o admin/organizador.
 * Espelha `tech.goticket.backendapi.event.dto.EventFullDTO`
 * retornado por `GET /events/{eventId}/details`.
 */
export interface EventDateSectorSummaryDTO {
    eventDateSectorId: number;
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number | null;
    mapElementId: string | null;
    totalTickets: number | null;
    soldTickets: number | null;
    availableTickets: number | null;
}

export interface EventDateFullDTO {
    eventDateId: number;
    startDate: string;
    endDate: string;
    statusId: number | null;
    statusName: string | null;
    registerDate: string;
    lastUpdateDate: string;
    dateSectors: EventDateSectorSummaryDTO[];
}

export interface EventSectorSummaryDTO {
    sectorId: number;
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number | null;
    mapElementId: string | null;
    venueSectorMaxCapacity: number | null;
}

export interface EventFullDTO {
    eventId: number;
    title: string;
    description: string;
    ageRestriction: number;
    salesStartDate: string | null;
    startDate: string;
    endDate: string;
    approvalDate: string | null;
    registerDate: string;
    lastUpdateDate: string;
    statusId: number;
    statusName: EventStatusName;
    visibilityId: number;
    visibilityName: EventVisibilityValue;
    category: { id: number; name: string; slug: string } | null;
    organizer: {
        userId: string;
        organizerName: string;
        legalName: string;
        cnpj: string;
    } | null;
    venue: {
        venueId: number;
        name: string;
        cnpj: string | null;
        description: string | null;
        streetAddress: string | null;
        streetAddressNumber: string | null;
        neighborhood: string | null;
        city: string;
        state: string;
        country: string | null;
        zipCode: string | null;
        sectorMapS3Key: string | null;
        sectorMapUrl: string | null;
    } | null;
    eventDates: EventDateFullDTO[];
    sectors: EventSectorSummaryDTO[];
    images: EventImageDTO[];
}

export interface CreateEventDatePayload {
    startDate: string;
    endDate: string;
}

export interface UpdateEventDatePayload {
    startDate: string;
    endDate: string;
}

export interface CreateEventSectorPayload {
    name: string;
    description: string;
    hasNumberedSeats: boolean;
    venueSectorId: number;
}

export interface UpdateEventSectorPayload {
    name?: string;
    description?: string;
    hasNumberedSeats?: boolean;
}

export interface VenueSectorOptionDTO {
    sectorID: number;
    name: string;
    description: string;
    maxCapacity: number;
    mapElementId: string | null;
}

/**
 * Payload aceito pelo `PATCH /events/{eventId}` (merge-patch+json).
 * A visibilidade é trocada no endpoint dedicado `/events/{eventId}/visibility`.
 */
export interface UpdateEventPayload {
    title?: string;
    description?: string;
    ageRestriction?: number;
    startDate?: string;
    endDate?: string;
    salesStartDate?: string | null;
    category?: { categoryId: number };
}
