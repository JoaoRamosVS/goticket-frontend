import goTicketApi from "@/services/api";
import type {
    CreateEventDatePayload,
    CreateEventSectorPayload,
    EventFullDTO,
    EventImageOrderItemDTO,
    EventMinListDTO,
    EventSectorSummaryDTO,
    EventStatusName,
    EventVisibilityValue,
    UpdateEventDatePayload,
    UpdateEventPayload,
    UpdateEventSectorPayload,
    VenueSectorOptionDTO,
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

/**
 * `POST /events/{eventId}/dates` — adiciona nova data ao evento.
 */
const createEventDate = async (
    eventId: number | string,
    payload: CreateEventDatePayload
): Promise<void> => {
    await goTicketApi.post(`/events/${eventId}/dates`, payload, {
        headers: authHeaders(),
    });
};

/**
 * `PATCH /events/{eventId}/dates/{eventDateId}` — atualiza intervalo de uma data.
 */
const updateEventDate = async (
    eventId: number | string,
    eventDateId: number | string,
    payload: UpdateEventDatePayload
): Promise<void> => {
    await goTicketApi.patch(
        `/events/${eventId}/dates/${eventDateId}`,
        payload,
        { headers: authHeaders() }
    );
};

/**
 * `DELETE /events/{eventId}/dates/{eventDateId}` — remove uma data do evento.
 */
const deleteEventDate = async (
    eventId: number | string,
    eventDateId: number | string
): Promise<void> => {
    await goTicketApi.delete(`/events/${eventId}/dates/${eventDateId}`, {
        headers: authHeaders(),
    });
};

/**
 * `GET /venues/{venueId}/sectors` — lista os setores configurados para o espaço,
 * usados como base para criar setores do evento.
 */
const listVenueSectors = async (
    venueId: number | string,
    signal?: AbortSignal
): Promise<VenueSectorOptionDTO[]> => {
    const response = await goTicketApi.get<VenueSectorOptionDTO[]>(
        `/venues/${venueId}/sectors`,
        { signal }
    );
    return response.data;
};

/**
 * `POST /events/{eventId}/sectors` — cria um setor do evento a partir de um
 * setor existente no espaço.
 */
const createEventSector = async (
    eventId: number | string,
    payload: CreateEventSectorPayload
): Promise<EventSectorSummaryDTO> => {
    const response = await goTicketApi.post<EventSectorSummaryDTO>(
        `/events/${eventId}/sectors`,
        payload,
        { headers: authHeaders() }
    );
    return response.data;
};

/**
 * `PATCH /events/{eventId}/sectors/{sectorId}` — atualiza nome/descrição/numeração
 * de um setor do evento.
 */
const updateEventSector = async (
    eventId: number | string,
    sectorId: number | string,
    payload: UpdateEventSectorPayload
): Promise<EventSectorSummaryDTO> => {
    const response = await goTicketApi.patch<EventSectorSummaryDTO>(
        `/events/${eventId}/sectors/${sectorId}`,
        payload,
        { headers: authHeaders() }
    );
    return response.data;
};

/**
 * `DELETE /events/{eventId}/sectors/{sectorId}` — remove um setor do evento
 * (só permitido se não houver datas vinculadas a ele).
 */
const deleteEventSector = async (
    eventId: number | string,
    sectorId: number | string
): Promise<void> => {
    await goTicketApi.delete(`/events/${eventId}/sectors/${sectorId}`, {
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
    createEventDate,
    updateEventDate,
    deleteEventDate,
    listVenueSectors,
    createEventSector,
    updateEventSector,
    deleteEventSector,
};
