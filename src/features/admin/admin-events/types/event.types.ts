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
        venueID: number;
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
    images: EventImageDTO[];
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
