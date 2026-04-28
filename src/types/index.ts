export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
}

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
 * Espelha `tech.goticket.backendapi.event.dto.EventCategoryDTO`
 * (`GET /event-categories`).
 */
export interface EventCategoryDTO {
    categoryId: number;
    name: string;
    slug: string;
}

/**
 * Payload aceito pelo `PATCH /event-categories/{categoryId}` (merge-patch+json).
 * O slug é gerado automaticamente pelo backend a partir do nome.
 */
export interface UpdateEventCategoryPayload {
    name?: string;
}

/**
 * Payload de criação utilizado em `POST /event-categories`.
 */
export interface CreateEventCategoryDTO {
    name: string;
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
 * Item enxuto usado na listagem `GET /venues`.
 * Espelha `tech.goticket.backendapi.venue.dto.VenueMinDTO`.
 */
export interface VenueMinDTO {
    venueID: number;
    name: string;
    legalName: string;
    CNPJ: string;
    city: string | null;
    state: string | null;
    country: string | null;
    statusName: "ACTIVE" | "INACTIVE" | null;
    organizerName: string | null;
    registerDate: string | null;
}

export interface VenueListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    venueMinDTOList: VenueMinDTO[];
}

/**
 * Resposta completa do `GET /venues/{venueId}`.
 * Espelha a entidade `tech.goticket.backendapi.venue.Venue`.
 */
export interface VenueDetailDTO {
    venueID: number;
    name: string;
    legalName: string;
    CNPJ: string;
    description: string | null;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    approvalDate: string | null;
    registerDate: string;
    lastUpdateDate: string;
    status: { statusID: number; name: "ACTIVE" | "INACTIVE" } | null;
    organizer: {
        userID: string;
        organizerName?: string;
        legalName?: string;
        CNPJ?: string;
    } | null;
}

/**
 * Payload aceito pelo `PATCH /venues/{venueId}` (merge-patch+json).
 */
export interface UpdateVenuePayload {
    name?: string;
    legalName?: string;
    CNPJ?: string;
    description?: string | null;
    streetAddress?: string;
    streetAddressNumber?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    status?: { statusID: number; name: "ACTIVE" | "INACTIVE" };
}

/**
 * Payload de criação utilizado em `POST /venues`.
 * Espelha `tech.goticket.backendapi.venue.dto.CreateVenueDTO`.
 */
export interface CreateVenueDTO {
    name: string;
    legalName: string;
    CNPJ: string;
    description?: string;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    organizerID?: string | null;
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

export type RoleValue = "ADMIN" | "ORGANIZER" | "CLIENT";
export type StatusValue = "ACTIVE" | "INACTIVE";

export interface RoleDTO {
    roleID: number;
    name: RoleValue;
}

export interface StatusDTO {
    statusID: number;
    name: StatusValue;
}

export interface UserDTO {
    userId: string;
    email: string;
    role: RoleDTO;
    status: StatusDTO;
}

export interface UserListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    userDTOList: UserDTO[];
}

/**
 * Payload de criação utilizado em `POST /clients`.
 * Espelha `tech.goticket.backendapi.client.dto.CreateClientDTO`.
 */
export interface ClientDTO {
    email: string;
    password: string;
    fullName: string;
    sex: number;
    identityDocument: string;
    birthDate: string;
}

/**
 * Resposta completa do `GET /clients/{clientId}`.
 * Espelha a entidade `tech.goticket.backendapi.client.Client`.
 */
export interface ClientDetailDTO {
    userID: string;
    email: string;
    role: RoleDTO;
    status: StatusDTO;
    fullName: string;
    sex: number;
    identityDocument: string;
    birthDate: string;
    registerDate: string;
    lastUpdateDate: string;
    streetAddress: string | null;
    streetAddressNumber: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
}

/**
 * Item enxuto usado na listagem `GET /clients`.
 * Espelha `tech.goticket.backendapi.client.dto.ClientMinDTO`.
 */
export interface ClientMinDTO {
    userID: string;
    email: string;
    fullName: string;
    identityDocument: string;
    sex: number | null;
    birthDate: string | null;
    city: string | null;
    state: string | null;
    statusName: StatusValue | null;
    registerDate: string | null;
}

export interface ClientListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    clientMinDTOList: ClientMinDTO[];
}

/**
 * Payload aceito pelo `PATCH /clients/{clientId}` (merge-patch+json).
 */
export interface UpdateClientPayload {
    email?: string;
    fullName?: string;
    sex?: number;
    identityDocument?: string;
    birthDate?: string;
    streetAddress?: string | null;
    streetAddressNumber?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
    status?: StatusDTO;
}

/**
 * Payload de criação utilizado em `POST /organizers`.
 * Espelha `tech.goticket.backendapi.organizer.dto.CreateOrganizerDTO`.
 */
export interface CreateOrganizerDTO {
    email: string;
    password: string;
    organizerName: string;
    legalName: string;
    CNPJ: string;
}

/**
 * Resposta completa do `GET /organizers/{organizerId}`.
 * Espelha a entidade `tech.goticket.backendapi.organizer.Organizer`.
 */
export interface OrganizerDetailDTO {
    userID: string;
    email: string;
    role: RoleDTO;
    status: StatusDTO;
    organizerName: string;
    legalName: string;
    CNPJ: string;
    registerDate: string;
    lastUpdateDate: string;
    streetAddress: string | null;
    streetAddressNumber: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
}

/**
 * Item enxuto usado na listagem `GET /organizers`.
 * Espelha `tech.goticket.backendapi.organizer.dto.OrganizerMinDTO`.
 */
export interface OrganizerMinDTO {
    userID: string;
    email: string;
    organizerName: string;
    legalName: string;
    CNPJ: string;
    city: string | null;
    state: string | null;
    statusName: StatusValue | null;
    registerDate: string | null;
}

export interface OrganizerListDTO {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    organizerMinDTOList: OrganizerMinDTO[];
}

/**
 * Payload aceito pelo `PATCH /organizers/{organizerId}` (merge-patch+json).
 */
export interface UpdateOrganizerPayload {
    email?: string;
    organizerName?: string;
    legalName?: string;
    CNPJ?: string;
    streetAddress?: string | null;
    streetAddressNumber?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
    status?: StatusDTO;
}