export type StatusValue = "ACTIVE" | "INACTIVE";

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
    role: { roleID: number; name: "ADMIN" | "ORGANIZER" | "CLIENT" };
    status: { statusID: number; name: StatusValue };
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
    status?: { statusID: number; name: StatusValue };
}
