import goTicketApi from "@/services/api";
import type { CreateEventPayload } from "@/features/organizer/organizer-new-event/types/newEvent.types";

/**
 * `POST /events` — criação de evento.
 *
 * Quando chamado por um organizador autenticado, o backend ignora o campo
 * `organizerID` do payload e vincula o evento ao usuário do token, sempre
 * com status `PENDING_APPROVAL`.
 *
 * O backend retorna `201 Created` com `Location: /events/{eventId}`.
 * Retorna o ID do evento criado extraído do header.
 */
const createEvent = async (payload: CreateEventPayload): Promise<number> => {
    const response = await goTicketApi.post<void>("/events", payload);
    const location = response.headers["location"] as string;
    const parts = location.split("/");
    return parseInt(parts[parts.length - 1], 10);
};

export default {
    createEvent,
};
