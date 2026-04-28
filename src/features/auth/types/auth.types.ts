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
