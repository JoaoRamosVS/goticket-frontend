import goTicketApi from "@/services/api";
import type { CreateEventPayload } from "@/features/organizer/organizer-new-event/types/newEvent.types";

/**
 * `POST /events` — criação de evento.
 *
 * Quando chamado por um organizador autenticado, o backend ignora o campo
 * `organizerID` do payload e vincula o evento ao usuário do token, sempre
 * com status `PENDING_APPROVAL`.
 *
 * O backend não retorna corpo, apenas `201 Created` com `Location`.
 */
const createEvent = async (payload: CreateEventPayload): Promise<void> => {
    await goTicketApi.post("/events", payload);
};

export default {
    createEvent,
};
