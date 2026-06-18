import goTicketApi from "@/services/api";
import type { QueueStatusResponse } from "../types/waiting-room.types";

async function enqueue(eventId: string | number): Promise<QueueStatusResponse> {
  const { data } = await goTicketApi.post<QueueStatusResponse>(`/events/${eventId}/queue`);
  return data;
}

async function getPosition(
  eventId: string | number,
  signal?: AbortSignal
): Promise<QueueStatusResponse> {
  const { data } = await goTicketApi.get<QueueStatusResponse>(
    `/events/${eventId}/queue/position`,
    { signal }
  );
  return data;
}

export default { enqueue, getPosition };
