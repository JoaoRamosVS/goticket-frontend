import goTicketApi from "@/services/api";
import type {
    CreateOrganizerDTO,
    LoginResponse,
    OrganizerDetailDTO,
    OrganizerListDTO,
    UpdateOrganizerPayload,
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
 * `POST /organizers` — cadastro público de um novo organizador.
 */
const createOrganizer = async (
    organizerData: CreateOrganizerDTO
): Promise<LoginResponse> => {
    const response = await goTicketApi.post("/organizers", organizerData);
    return response.data as LoginResponse;
};

/**
 * `GET /organizers` — lista paginada de organizadores (admin-only).
 */
const listOrganizers = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<OrganizerListDTO> => {
    const response = await goTicketApi.get<OrganizerListDTO>("/organizers", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /organizers/{organizerId}` — detalhes completos do organizador.
 * Exige SCOPE_ADMIN ou que o próprio organizador esteja autenticado.
 */
const getOrganizerById = async (
    organizerId: string,
    signal?: AbortSignal
): Promise<OrganizerDetailDTO> => {
    const response = await goTicketApi.get<OrganizerDetailDTO>(
        `/organizers/${organizerId}`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `PATCH /organizers/{organizerId}` — atualização parcial com merge-patch+json.
 */
const updateOrganizer = async (
    organizerId: string,
    payload: UpdateOrganizerPayload
): Promise<OrganizerDetailDTO> => {
    const response = await goTicketApi.patch<OrganizerDetailDTO>(
        `/organizers/${organizerId}`,
        payload,
        {
            headers: authHeaders({
                "Content-Type": "application/merge-patch+json",
            }),
        }
    );
    return response.data;
};

export default {
    createOrganizer,
    listOrganizers,
    getOrganizerById,
    updateOrganizer,
};
