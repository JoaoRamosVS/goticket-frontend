import goTicketApi from "@/services/api";
import type { EventPageDTO } from "@/features/event-details/types/event-details.types";

const getEventForPurchase = async (
    eventId: number | string,
    signal?: AbortSignal
): Promise<EventPageDTO> => {
    const response = await goTicketApi.get<EventPageDTO>(`/events/${eventId}`, {
        signal,
    });
    return response.data;
};

export default {
    getEventForPurchase,
};
