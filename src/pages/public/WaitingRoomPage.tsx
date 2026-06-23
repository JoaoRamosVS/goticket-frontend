import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useWaitingRoom from "@/features/waiting-room/hooks/useWaitingRoom";
import WaitingRoomCard from "@/features/waiting-room/components/WaitingRoomCard";
import useEventDetails from "@/features/event-details/hooks/useEventDetails";

/** State mínimo vindo do TicketSelector: apenas o eventDateId da data escolhida. */
interface WaitingRoomLocationState {
  eventDateId: number;
}

export default function WaitingRoomPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve eventDateId uma vez: location.state (fluxo normal) ?? sessionStorage (reload/F5).
  const [eventDateId] = useState<number | null>(() => {
    const fromState = (location.state as WaitingRoomLocationState | null)?.eventDateId ?? null;
    if (fromState) return fromState;

    // Fallback: tenta recuperar de sessionStorage para sobreviver a reload.
    try {
      const raw = sessionStorage.getItem("goticket:waiting-room-date");
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });

  // Persiste eventDateId para sobreviver a reload (F5) durante a espera.
  useEffect(() => {
    if (eventDateId != null) {
      try {
        sessionStorage.setItem("goticket:waiting-room-date", String(eventDateId));
      } catch {
        // sessionStorage indisponível — segue sem persistência.
      }
    }
  }, [eventDateId]);

  // Busca dados do evento para exibir no WaitingRoomCard.
  const { event, isLoading: eventLoading } = useEventDetails(eventId);

  const queue = useWaitingRoom(eventId);

  // Sem eventDateId válido (acesso direto / estado perdido) → volta ao evento.
  useEffect(() => {
    if (eventDateId == null) {
      navigate(eventId ? `/evento/${eventId}` : "/", { replace: true });
    }
  }, [eventDateId, eventId, navigate]);

  // Admitido → segue para a página de ingressos da data escolhida, carregando o token de admissão.
  useEffect(() => {
    if (queue.phase === "ADMITTED" && eventDateId != null) {
      // Limpa o eventDateId persistido — já passou pela fila.
      try {
        sessionStorage.removeItem("goticket:waiting-room-date");
      } catch {
        // noop
      }

      navigate(
        `/evento/${eventId}/data/${eventDateId}/ingressos`,
        {
          replace: true,
          state: { admissionToken: queue.admissionToken },
        },
      );
    }
  }, [queue.phase, queue.admissionToken, eventDateId, eventId, navigate]);

  if (eventDateId == null) return null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-12 mt-24">
      {(queue.phase === "INIT" || queue.phase === "ADMITTED" || eventLoading) && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">
            {queue.phase === "ADMITTED"
              ? "Liberando seu acesso..."
              : "Verificando disponibilidade..."}
          </p>
        </div>
      )}

      {queue.phase === "WAITING" && event && (
        <WaitingRoomCard
          eventTitle={event.title}
          startDate={event.date.start}
          venueName={event.venue.name}
          venueCity={event.venue.city}
          position={queue.position}
          totalInQueue={queue.totalInQueue}
          estimatedWaitSeconds={queue.estimatedWaitSeconds}
        />
      )}

      {queue.phase === "ERROR" && (
        <div className="max-w-md space-y-3 rounded-4xl border border-destructive/20 bg-destructive/10 p-8 text-center">
          <p className="font-semibold text-destructive">Não foi possível entrar na fila</p>
          <p className="text-sm text-muted-foreground">{queue.error}</p>
          <button
            onClick={() => navigate(`/evento/${eventId}`)}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Voltar ao evento
          </button>
        </div>
      )}
    </div>
  );
}
