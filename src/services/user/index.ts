import goTicketApi from "@/services/api";
import type {
    LoginRequest,
    LoginResponse,
    UserDTO,
    UserListDTO,
} from "@/types";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { ...(extra ?? {}) };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await goTicketApi.post("/login", loginData);
    return response.data as LoginResponse;
};

const getUser = async (): Promise<UserDTO> => {
    const response = await goTicketApi.get("/user", {
        headers: authHeaders(),
    });

    return response.data as UserDTO;
};

/**
 * `GET /users/all` — Lista paginada de todos os usuários (admin-only).
 * Retorna apenas dados básicos (id, email, role, status).
 */
const listAllUsers = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<UserListDTO> => {
    const response = await goTicketApi.get<UserListDTO>("/users/all", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /users` — Lista paginada apenas de usuários ativos (admin-only).
 */
const listActiveUsers = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<UserListDTO> => {
    const response = await goTicketApi.get<UserListDTO>("/users", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

export default { login, getUser, listAllUsers, listActiveUsers };
