import goTicketApi from "@/services/api";
import type {
    EventFullDTO,
    EventImageOrderItemDTO,
    EventMinListDTO,
    EventStatusName,
    EventVisibilityValue,
    UpdateEventPayload,
} from "@/features/admin/admin-events/types/event.types";

/**
 * `GET /events` — listagem pública de eventos aprovados/visíveis.
 */
const getEvents = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get<EventMinListDTO>("/events", {
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { ...(extra ?? {}) };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

/**
 * `GET /events/all` — listagem admin-only com todos os eventos
 * (qualquer status/visibilidade).
 */
const getAdminEvents = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get<EventMinListDTO>("/events/all", {
        headers: authHeaders(),
        params: { page, pageSize },
        signal,
    });
    return response.data;
};

/**
 * `GET /events/{eventId}/details` — visão completa do evento para admin/organizador.
 * Retorna `EventFullDTO` com todos os campos editáveis e metadados.
 */
const getAdminEventDetails = async (
    eventId: number | string,
    signal?: AbortSignal
): Promise<EventFullDTO> => {
    const response = await goTicketApi.get<EventFullDTO>(
        `/events/${eventId}/details`,
        {
            headers: authHeaders(),
            signal,
        }
    );
    return response.data;
};

/**
 * `PATCH /events/{eventId}` — atualização parcial com merge-patch+json.
 * Retorna `EventFullDTO` atualizado.
 */
const updateEvent = async (
    eventId: number | string,
    payload: UpdateEventPayload
): Promise<EventFullDTO> => {
    const response = await goTicketApi.patch<EventFullDTO>(
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
 * `PUT /events/{eventId}/images` — substitui a galeria conforme `metadata` + arquivos `newImages`.
 */
const replaceEventImages = async (
    eventId: number | string,
    metadata: EventImageOrderItemDTO[],
    newImageFiles: File[]
): Promise<void> => {
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    newImageFiles.forEach((file) => formData.append("newImages", file));

    await goTicketApi.put(`/events/${eventId}/images`, formData, {
        headers: authHeaders(),
        transformRequest: [
            (data, headers) => {
                if (data instanceof FormData) {
                    delete headers["Content-Type"];
                }
                return data;
            },
        ],
    });
};

/**
 * `PATCH /events/{eventId}/status` — altera o status do evento (admin-only).
 */
const updateEventStatus = async (
    eventId: number | string,
    status: EventStatusName
): Promise<void> => {
    await goTicketApi.patch(
        `/events/${eventId}/status`,
        { status },
        { headers: authHeaders() }
    );
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
    getAdminEvents,
    getAdminEventDetails,
    updateEvent,
    updateEventVisibility,
    updateEventStatus,
    replaceEventImages,
    deleteEvent,
};
