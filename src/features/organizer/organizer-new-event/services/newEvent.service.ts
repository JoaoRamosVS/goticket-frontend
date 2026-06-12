import goTicketApi from "@/services/api";
import type { CreateEventPayload } from "@/features/organizer/organizer-new-event/types/newEvent.types";

const createEvent = async (payload: CreateEventPayload): Promise<number> => {
    const response = await goTicketApi.post<void>("/events", payload);
    const location = response.headers["location"] as string;
    const parts = location.split("/");
    return parseInt(parts[parts.length - 1], 10);
};

/**
 * `PUT /events/{id}/images` — substitui todas as imagens do evento.
 * Envia os arquivos como `multipart/form-data` com metadados de ordem.
 */
const uploadEventImages = async (eventId: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    const metadata = files.map((_, index) => ({ type: "new", fileIndex: index }));
    formData.append("metadata", JSON.stringify(metadata));
    files.forEach((file) => formData.append("newImages", file));
    await goTicketApi.put(`/events/${eventId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export default {
    createEvent,
    uploadEventImages,
};
