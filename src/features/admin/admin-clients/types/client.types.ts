export type StatusValue = "ACTIVE" | "INACTIVE";

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
    role: { roleID: number; name: "ADMIN" | "ORGANIZER" | "CLIENT" };
    status: { statusID: number; name: StatusValue };
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
    status?: { statusID: number; name: StatusValue };
}

export interface ClientLoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
