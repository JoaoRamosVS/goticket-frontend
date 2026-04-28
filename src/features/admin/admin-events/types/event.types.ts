import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

/**
 * Representa o payload retornado pelo endpoint `GET /events`.
 * Espelha `tech.goticket.backendapi.event.dto.EventMinDTO`.
 *
 * `startDate` vem como `LocalDateTime` serializado pelo Jackson
 * (ex.: "2025-12-01T18:00:00") e `startingPrice` como BigDecimal
 * serializado como número ou string.
 */
export interface EventMinDTO {
    eventID: number;
    title: string;
    startDate: string;
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
    eventImageID: number;
    s3Key: string;
    /** Ordem no backend; posição 0 = imagem principal. */
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
 * Representa o payload de `GET /events/{eventId}`.
 * Espelha a entidade `tech.goticket.backendapi.event.Event`.
 */
export interface EventDetailDTO {
    eventID: number;
    title: string;
    description: string;
    ageRestriction: number;
    salesStartDate: string | null;
    startDate: string;
    endDate: string;
    approvalDate: string | null;
    registerDate: string;
    lastUpdateDate: string;
    status: { statusID: number; name: EventStatusName };
    eventVisibility: { visibilityID: number; name: EventVisibilityValue };
    category: EventCategoryDTO | null;
    organizer: { userID: string; fullName?: string } | null;
    venue: {
        venueID: number;
        name: string;
        city: string;
        state: string;
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
