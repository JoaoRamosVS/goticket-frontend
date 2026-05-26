import goTicketApi from "@/services/api";
import type {
    CreateVenuePayload,
    UpsertVenueSectorDTO,
    UpdateVenuePayload,
    VenueDetailDTO,
    VenueListDTO,
    VenueSectorDTO,
} from "@/features/admin/admin-venues/types/venue.types";

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
 * `POST /venues` — cria um novo espaço (admin ou organizador).
 * Resposta: corpo com o mesmo formato de `GET /venues/{id}`.
 */
const createVenue = async (payload: CreateVenuePayload): Promise<VenueDetailDTO> => {
    const body = {
        ...payload,
        organizerId: payload.organizerId ?? undefined,
    };
    const response = await goTicketApi.post<VenueDetailDTO>("/venues", body, {
        headers: authHeaders(),
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

const listVenueSectors = async (
    venueId: number | string,
    signal?: AbortSignal
): Promise<VenueSectorDTO[]> => {
    const response = await goTicketApi.get<VenueSectorDTO[]>(
        `/venues/${venueId}/sectors`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

const replaceVenueSectors = async (
    venueId: number | string,
    sectors: UpsertVenueSectorDTO[]
): Promise<VenueSectorDTO[]> => {
    const response = await goTicketApi.put<VenueSectorDTO[]>(
        `/venues/${venueId}/sectors`,
        { sectors },
        {
            headers: authHeaders(),
        }
    );
    return response.data;
};

const uploadVenueSectorMap = async (
    venueId: number | string,
    mapFile: File
): Promise<VenueDetailDTO> => {
    const formData = new FormData();
    formData.append("mapFile", mapFile);

    const response = await goTicketApi.put<VenueDetailDTO>(
        `/venues/${venueId}/sector-map`,
        formData,
        {
            headers: authHeaders({
                "Content-Type": "multipart/form-data",
            }),
        }
    );
    return response.data;
};

export default {
    listVenues,
    createVenue,
    getVenueById,
    updateVenue,
    deleteVenue,
    listVenueSectors,
    replaceVenueSectors,
    uploadVenueSectorMap,
};
