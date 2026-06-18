import { Clock, Users } from "lucide-react";
import { formatDate, formatTime } from "@/features/event-details/utils/helpers";

interface WaitingRoomCardProps {
  eventTitle: string;
  startDate: string;
  venueName: string;
  venueCity: string;
  position: number | null;
  totalInQueue: number | null;
  estimatedWaitSeconds: number | null;
}

function formatWait(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return "menos de 1 min";
  if (seconds < 60) return `~${seconds}s`;
  return `~${Math.ceil(seconds / 60)} min`;
}

export default function WaitingRoomCard({
  eventTitle,
  startDate,
  venueName,
  venueCity,
  position,
  totalInQueue,
  estimatedWaitSeconds,
}: WaitingRoomCardProps) {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-4xl border bg-background/60 backdrop-blur-xl shadow-2xl shadow-primary/20">
      <div className="bg-linear-to-br from-primary to-[#2959b9] p-8 text-center text-primary-foreground">
        <div className="mx-auto mb-5 size-12 rounded-full border-4 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
          Sala de espera
        </p>
        <h1 className="mt-1.5 text-2xl font-extrabold leading-tight">{eventTitle}</h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          {formatDate(startDate)}, {formatTime(startDate)} · {venueName}, {venueCity}
        </p>
      </div>

      <div className="space-y-6 p-8">
        <p className="text-center text-sm text-muted-foreground">
          Este evento está com alta demanda. Você está na fila e será direcionado
          automaticamente para a compra quando for a sua vez.
        </p>

        <div className="rounded-3xl border bg-background/40 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sua posição na fila
          </p>
          <p className="mt-1 text-6xl font-extrabold italic tabular-nums text-primary">
            {position ?? "—"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border bg-background/40 p-4 text-center">
            <Users className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-xs text-muted-foreground">Pessoas na fila</p>
            <p className="font-bold tabular-nums text-foreground">{totalInQueue ?? "—"}</p>
          </div>
          <div className="rounded-2xl border bg-background/40 p-4 text-center">
            <Clock className="mx-auto size-5 text-muted-foreground" />
            <p className="mt-1 text-xs text-muted-foreground">Espera estimada</p>
            <p className="font-bold text-foreground">{formatWait(estimatedWaitSeconds)}</p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Mantenha esta página aberta. Não atualize nem feche o navegador.
        </p>
      </div>
    </div>
  );
}
