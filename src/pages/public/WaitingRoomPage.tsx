import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useWaitingRoom from "@/features/waiting-room/hooks/useWaitingRoom";
import WaitingRoomCard from "@/features/waiting-room/components/WaitingRoomCard";
import type { CheckoutNavigationState } from "@/features/checkout/types/checkout-state.types";
import {
  loadPurchaseContext,
  savePurchaseContext,
} from "@/features/checkout/utils/purchase-context";

export default function WaitingRoomPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Seleção resolvida uma vez: location.state (vindo da seleção de ingressos) ?? sessionStorage (reload).
  const [selection] = useState<CheckoutNavigationState | null>(
    () => (location.state as CheckoutNavigationState | null) ?? loadPurchaseContext()
  );

  const queue = useWaitingRoom(selection ? eventId : undefined);

  // Persiste a seleção para sobreviver a reload (F5) durante a espera.
  useEffect(() => {
    if (selection) savePurchaseContext(selection);
  }, [selection]);

  // Sem seleção válida (acesso direto / estado perdido) → volta ao evento.
  useEffect(() => {
    if (!selection) {
      navigate(eventId ? `/evento/${eventId}` : "/", { replace: true });
    }
  }, [selection, eventId, navigate]);

  // Admitido → segue para o checkout carregando a seleção + o token de admissão.
  useEffect(() => {
    if (queue.phase === "ADMITTED" && selection) {
      navigate("/checkout", {
        replace: true,
        state: {
          ...selection,
          admissionToken: queue.admissionToken,
        } satisfies CheckoutNavigationState,
      });
    }
  }, [queue.phase, queue.admissionToken, selection, navigate]);

  if (!selection) return null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-12 mt-24">
      {(queue.phase === "INIT" || queue.phase === "ADMITTED") && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">
            {queue.phase === "ADMITTED"
              ? "Liberando seu acesso..."
              : "Verificando disponibilidade..."}
          </p>
        </div>
      )}

      {queue.phase === "WAITING" && (
        <WaitingRoomCard
          eventTitle={selection.eventTitle}
          startDate={selection.startDate}
          venueName={selection.venueName}
          venueCity={selection.venueCity}
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
