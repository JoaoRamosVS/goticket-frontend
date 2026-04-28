import goTicketApi from "@/services/api";
import type { EventPageDTO } from "@/features/event-details/types/event-details.types";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
    const accessToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = { ...(extra ?? {}) };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
}

const getEventById = async ( eventId: number | string, signal?: AbortSignal): Promise<EventPageDTO> => {
    const response = await goTicketApi.get<EventPageDTO>(`/events/${eventId}`, {
        headers: authHeaders(),
        signal,
    });
    return response.data;
};

export default {
    getEventById,
};
