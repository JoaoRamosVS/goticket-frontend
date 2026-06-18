export type QueueState = "WAITING" | "ADMITTED";

/** Espelha tech.goticket.backendapi.waitingroom.dto.QueueStatusResponse */
export interface QueueStatusResponse {
  state: QueueState;
  eventId: number;
  position: number | null;
  totalInQueue: number | null;
  estimatedWaitSeconds: number | null;
  admissionToken: string | null;
}
