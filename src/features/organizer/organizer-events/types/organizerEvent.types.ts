export type EventStatusName =
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "COMPLETED"
    | "DECLINED"
    | "CANCELED"
    | "POSTPONED";

export type EventVisibilityValue = "PUBLIC" | "PRIVATE";

/**
 * Item do payload `GET /events/mine` — espelha `tech.goticket.backendapi.event.dto.OrganizerEventListItemDTO`.
 */
export interface OrganizerEventListItemDTO {
    eventID: number;
    title: string;
    statusName: EventStatusName | null;
    visibilityName: EventVisibilityValue | null;
    categoryName: string | null;
    venueName: string | null;
    venueCity: string | null;
    venueState: string | null;
    startDate: string | null;
    endDate: string | null;
    registerDate: string | null;
    lastUpdateDate: string | null;
    approvalDate: string | null;
    mainImageKey: string | null;
}

export interface OrganizerEventListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    events: OrganizerEventListItemDTO[];
}
