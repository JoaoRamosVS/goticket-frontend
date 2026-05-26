/**
 * Item enxuto usado na listagem `GET /venues`.
 * Espelha `tech.goticket.backendapi.venue.dto.VenueMinDTO`.
 */
export interface VenueMinDTO {
    venueId: number;
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
    venueId: number;
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
    sectorMapS3Key?: string | null;
    approvalDate: string | null;
    registerDate: string;
    lastUpdateDate: string;
    status: { statusId: number; name: "ACTIVE" | "INACTIVE" } | null;
    organizer: {
        userId: string;
        organizerName?: string;
        legalName?: string;
        CNPJ?: string;
    } | null;
}

export interface VenueSectorDTO {
    sectorId: number;
    name: string;
    description: string;
    maxCapacity: number;
    mapElementId?: string | null;
}

export interface UpsertVenueSectorDTO {
    sectorId?: number;
    name: string;
    description: string;
    maxCapacity: number;
    mapElementId?: string | null;
}

/**
 * Payload de `POST /venues` (admin exige `organizerID`).
 * Espelha `tech.goticket.backendapi.venue.dto.CreateVenueDTO`.
 */
export interface CreateVenuePayload {
    name: string;
    legalName: string;
    CNPJ: string;
    description: string;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    organizerId: string | null;
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
    status?: { statusId: number; name: "ACTIVE" | "INACTIVE" };
}

