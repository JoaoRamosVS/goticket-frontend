import goTicketApi from "@/services/api";
import type { OrganizerEventListDTO } from "@/features/organizer/organizer-events/types/organizerEvent.types";

/**
 * `GET /events/mine` — lista paginada de eventos do organizador logado,
 * em todos os status (PENDING_APPROVAL, APPROVED, COMPLETED, DECLINED, CANCELED, POSTPONED).
 */
const listMyEvents = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<OrganizerEventListDTO> => {
    const response = await goTicketApi.get<OrganizerEventListDTO>(
        "/events/mine",
        {
            params: { page, pageSize },
            signal,
        }
    );
    return response.data;
};

export default {
    listMyEvents,
};
