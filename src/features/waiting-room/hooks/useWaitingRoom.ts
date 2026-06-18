import { useEffect, useState } from "react";
import waitingRoomService from "../services/waiting-room.service";
import type { QueueStatusResponse } from "../types/waiting-room.types";

export type WaitingRoomPhase = "INIT" | "WAITING" | "ADMITTED" | "ERROR";

export interface WaitingRoomState {
  phase: WaitingRoomPhase;
  position: number | null;
  totalInQueue: number | null;
  estimatedWaitSeconds: number | null;
  admissionToken: string | null;
  error: string | null;
}

const POLL_INTERVAL_MS = 4000;

const INITIAL_STATE: WaitingRoomState = {
  phase: "INIT",
  position: null,
  totalInQueue: null,
  estimatedWaitSeconds: null,
  admissionToken: null,
  error: null,
};

/**
 * Entra na fila virtual (POST /events/{id}/queue) e, enquanto WAITING, faz polling de
 * GET /events/{id}/queue/position a cada ~4s (alinhado ao job de admissão de 5s do backend),
 * até a admissão. setTimeout recursivo evita requisições sobrepostas; AbortController + flag
 * `mounted` limpam o ciclo no unmount.
 */
export default function useWaitingRoom(eventId: string | undefined): WaitingRoomState {
  const [state, setState] = useState<WaitingRoomState>(INITIAL_STATE);

  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();

    const scheduleNextPoll = () => {
      timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
    };

    const applyStatus = (status: QueueStatusResponse) => {
      if (!mounted) return;
      if (status.state === "ADMITTED") {
        setState({
          phase: "ADMITTED",
          position: null,
          totalInQueue: null,
          estimatedWaitSeconds: null,
          admissionToken: status.admissionToken,
          error: null,
        });
        return; // admitido: encerra o polling (não reagenda)
      }
      setState({
        phase: "WAITING",
        position: status.position,
        totalInQueue: status.totalInQueue,
        estimatedWaitSeconds: status.estimatedWaitSeconds,
        admissionToken: null,
        error: null,
      });
      scheduleNextPoll();
    };

    const poll = async () => {
      try {
        const status = await waitingRoomService.getPosition(eventId, controller.signal);
        applyStatus(status);
      } catch {
        if (!mounted || controller.signal.aborted) return;
        // Erro transitório (rede): mantém o usuário na fila e tenta de novo no próximo ciclo.
        scheduleNextPoll();
      }
    };

    (async () => {
      try {
        const status = await waitingRoomService.enqueue(eventId);
        applyStatus(status);
      } catch {
        if (!mounted) return;
        setState({
          ...INITIAL_STATE,
          phase: "ERROR",
          error: "Não foi possível entrar na fila. Tente novamente.",
        });
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [eventId]);

  return state;
}
