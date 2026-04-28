import type {
    EventDetailDTO,
    EventImageDTO,
    EventImageOrderItemDTO,
    EventMinDTO,
    EventMinListDTO,
    EventStatusName,
    EventVisibilityValue,
    UpdateEventPayload,
} from "@/features/admin-events/types/event.types";
import type {
    ClientDTO,
    ClientDetailDTO,
    ClientListDTO,
    ClientLoginResponse,
    ClientMinDTO,
    UpdateClientPayload,
} from "@/features/admin-clients/types/client.types";
import type {
    CreateVenueDTO,
    UpdateVenuePayload,
    VenueDetailDTO,
    VenueListDTO,
    VenueMinDTO,
} from "@/features/admin-spaces/types/space.types";
import type {
    CreateOrganizerDTO,
    OrganizerDetailDTO,
    OrganizerListDTO,
    OrganizerMinDTO,
    UpdateOrganizerPayload,
} from "@/features/admin-organizers/types/organizer.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export type {
    EventMinDTO,
    EventMinListDTO,
    EventVisibilityValue,
    EventStatusName,
    EventImageDTO,
    EventImageOrderItemDTO,
    EventDetailDTO,
};

export type {
    VenueMinDTO,
    VenueListDTO,
    VenueDetailDTO,
    UpdateVenuePayload,
    CreateVenueDTO,
};

export type { UpdateEventPayload };

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
export type {
    CreateOrganizerDTO,
    OrganizerDetailDTO,
    OrganizerMinDTO,
    OrganizerListDTO,
    UpdateOrganizerPayload,
};

export type {
    ClientDTO,
    ClientDetailDTO,
    ClientMinDTO,
    ClientListDTO,
    UpdateClientPayload,
    ClientLoginResponse,
};