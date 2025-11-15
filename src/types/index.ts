export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
}

export interface EventMinDTO {
    eventID: number;
    title: string;
    startDate: string;
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