import goTicketApi from "@/services/api";
import type {
    EventDetailDTO,
    EventMinListDTO,
    EventVisibilityValue,
    UpdateEventPayload,
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
 * `GET /events` — Lista pública de eventos aprovados + públicos.
 * É o único endpoint de listagem existente no backend atualmente.
 * O admin usa ele; filtragem por título/ID extra é feita client-side.
 */
const getEvents = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get<EventMinListDTO>("/events", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /events/{eventId}` — detalhes completos de um evento.
 */
const getEventById = async (
    eventId: number | string,
    signal?: AbortSignal
): Promise<EventDetailDTO> => {
    const response = await goTicketApi.get<EventDetailDTO>(
        `/events/${eventId}`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `PATCH /events/{eventId}` — atualização parcial com merge-patch+json.
 * Aceita apenas os campos primitivos do evento. Visibilidade tem endpoint próprio.
 */
const updateEvent = async (
    eventId: number | string,
    payload: UpdateEventPayload
): Promise<EventDetailDTO> => {
    const response = await goTicketApi.patch<EventDetailDTO>(
        `/events/${eventId}`,
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
 * `PATCH /events/{eventId}/visibility` — alterna entre PUBLIC e PRIVATE.
 * O backend exige que o evento esteja aprovado para aceitar a troca.
 */
const updateEventVisibility = async (
    eventId: number | string,
    visibility: EventVisibilityValue
): Promise<void> => {
    await goTicketApi.patch(
        `/events/${eventId}/visibility`,
        { visibility },
        { headers: authHeaders() }
    );
};

/**
 * `PATCH /events/{eventId}/images` — upload multipart de imagens.
 * Anexa novas imagens ao evento e marca a de índice `mainImageIndex` como principal.
 */
const uploadEventImages = async (
    eventId: number | string,
    files: File[],
    mainImageIndex: number = 0
): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("mainImageIndex", String(mainImageIndex));

    await goTicketApi.patch(`/events/${eventId}/images`, formData, {
        headers: authHeaders({
            "Content-Type": "multipart/form-data",
        }),
    });
};

/**
 * `DELETE /events/{eventId}` — exclusão do evento.
 */
const deleteEvent = async (eventId: number | string): Promise<void> => {
    await goTicketApi.delete(`/events/${eventId}`, {
        headers: authHeaders(),
    });
};

export default {
    getEvents,
    getEventById,
    updateEvent,
    updateEventVisibility,
    uploadEventImages,
    deleteEvent,
};
