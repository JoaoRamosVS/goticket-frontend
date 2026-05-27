import goTicketApi from "@/services/api";
import type {
    EventConfigureResponse,
    EventSectorSummary,
    CreateEventSectorPayload,
    CreateEventDateSectorPayload,
    EventDateSectorFull,
    CreateTicketBatchPayload,
    TicketBatchFull,
} from "@/features/event-configure/types/eventConfigure.types";
import type { VenueSectorDTO } from "@/features/admin/admin-venues/types/venue.types";

const getEventDetails = async (
    eventId: number,
    signal?: AbortSignal
): Promise<EventConfigureResponse> => {
    const response = await goTicketApi.get<EventConfigureResponse>(
        `/events/${eventId}/details`,
        { signal }
    );
    return response.data;
};

const listVenueSectors = async (
    venueId: number,
    signal?: AbortSignal
): Promise<VenueSectorDTO[]> => {
    const response = await goTicketApi.get<VenueSectorDTO[]>(
        `/venues/${venueId}/sectors`,
        { signal }
    );
    return response.data;
};

const createEventSector = async (
    eventId: number,
    payload: CreateEventSectorPayload
): Promise<EventSectorSummary> => {
    const response = await goTicketApi.post<EventSectorSummary>(
        `/events/${eventId}/sectors`,
        payload
    );
    return response.data;
};

const deleteEventSector = async (
    eventId: number,
    sectorId: number
): Promise<void> => {
    await goTicketApi.delete(`/events/${eventId}/sectors/${sectorId}`);
};

const linkDateSector = async (
    eventId: number,
    eventDateId: number,
    payload: CreateEventDateSectorPayload
): Promise<EventDateSectorFull> => {
    const response = await goTicketApi.post<EventDateSectorFull>(
        `/events/${eventId}/dates/${eventDateId}/sectors`,
        payload
    );
    return response.data;
};

const unlinkDateSector = async (
    eventId: number,
    eventDateId: number,
    eventDateSectorId: number
): Promise<void> => {
    await goTicketApi.delete(
        `/events/${eventId}/dates/${eventDateId}/sectors/${eventDateSectorId}`
    );
};

const createBatch = async (
    eventId: number,
    eventDateSectorId: number,
    payload: CreateTicketBatchPayload
): Promise<TicketBatchFull[]> => {
    const response = await goTicketApi.post<TicketBatchFull[]>(
        `/events/${eventId}/date-sectors/${eventDateSectorId}/batches`,
        payload
    );
    return response.data;
};

const deleteBatch = async (eventId: number, batchId: number): Promise<void> => {
    await goTicketApi.delete(`/events/${eventId}/batches/${batchId}`);
};

export default {
    getEventDetails,
    listVenueSectors,
    createEventSector,
    deleteEventSector,
    linkDateSector,
    unlinkDateSector,
    createBatch,
    deleteBatch,
};
