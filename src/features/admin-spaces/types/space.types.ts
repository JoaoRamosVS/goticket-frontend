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
