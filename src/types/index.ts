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

export interface UserDTO {
    userId: number;
    email: string;
    role: string;
    status: number;
}

export interface ClientDTO {
    email: string;
    password: string;
    fullName: string;
    sex: number;
    identityDocument: string;
    birthDate: string;
}