import goTicketApi from "@/services/api";
import type {
    ClientDTO,
    ClientDetailDTO,
    ClientListDTO,
    LoginResponse,
    UpdateClientPayload,
} from "@/types";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { ...(extra ?? {}) };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

/**
 * `POST /clients` — cadastro público de um novo cliente.
 */
const createClient = async (clientData: ClientDTO): Promise<LoginResponse> => {
    const response = await goTicketApi.post("/clients", clientData);
    return response.data as LoginResponse;
};

/**
 * `GET /clients` — lista paginada de clientes (admin-only).
 */
const listClients = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<ClientListDTO> => {
    const response = await goTicketApi.get<ClientListDTO>("/clients", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /clients/{clientId}` — detalhes completos do cliente.
 * Exige SCOPE_ADMIN ou que o próprio cliente esteja autenticado.
 */
const getClientById = async (
    clientId: string,
    signal?: AbortSignal
): Promise<ClientDetailDTO> => {
    const response = await goTicketApi.get<ClientDetailDTO>(
        `/clients/${clientId}`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `PATCH /clients/{clientId}` — atualização parcial com merge-patch+json.
 */
const updateClient = async (
    clientId: string,
    payload: UpdateClientPayload
): Promise<ClientDetailDTO> => {
    const response = await goTicketApi.patch<ClientDetailDTO>(
        `/clients/${clientId}`,
        payload,
        {
            headers: authHeaders({
                "Content-Type": "application/merge-patch+json",
            }),
        }
    );
    return response.data;
};

export default { createClient, listClients, getClientById, updateClient };
