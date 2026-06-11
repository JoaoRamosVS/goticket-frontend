export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    sex: number;
    identityDocument: string;
    birthDate: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface OrganizerRegisterRequest {
    email: string;
    password: string;
    organizerName: string;
    legalName: string;
    CNPJ: string;
}

type RoleValue = "ADMIN" | "ORGANIZER" | "CLIENT";
type StatusValue = "ACTIVE" | "INACTIVE";

interface RoleDTO {
    roleId: number;
    name: RoleValue;
}

interface StatusDTO {
    statusId: number;
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
