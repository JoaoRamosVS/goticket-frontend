import goTicketApi from "@/services/api";
import type {
    CreateVenueDTO,
    UpdateVenuePayload,
    VenueDetailDTO,
    VenueListDTO,
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
 * `GET /venues` — lista paginada de espaços (admin-only).
 */
const listVenues = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<VenueListDTO> => {
    const response = await goTicketApi.get<VenueListDTO>("/venues", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /venues/{venueId}` — detalhes completos de um espaço.
 */
const getVenueById = async (
    venueId: number | string,
    signal?: AbortSignal
): Promise<VenueDetailDTO> => {
    const response = await goTicketApi.get<VenueDetailDTO>(
        `/venues/${venueId}`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `POST /venues` — cadastro de um novo espaço (admin ou organizador).
 */
const createVenue = async (venueData: CreateVenueDTO): Promise<void> => {
    await goTicketApi.post("/venues", venueData, {
        headers: authHeaders(),
    });
};

/**
 * `PATCH /venues/{venueId}` — atualização parcial com merge-patch+json.
 */
const updateVenue = async (
    venueId: number | string,
    payload: UpdateVenuePayload
): Promise<VenueDetailDTO> => {
    const response = await goTicketApi.patch<VenueDetailDTO>(
        `/venues/${venueId}`,
        payload,
        {
            headers: authHeaders({
                "Content-Type": "application/merge-patch+json",
            }),
        }
    );
    return response.data;
};

/**
 * `DELETE /venues/{venueId}` — exclusão permanente do espaço.
 */
const deleteVenue = async (venueId: number | string): Promise<void> => {
    await goTicketApi.delete(`/venues/${venueId}`, {
        headers: authHeaders(),
    });
};

export default {
    listVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue,
};
