import { CalendarDays, ChevronRight, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatTime } from "@/features/event-details/utils/helpers";
import type {
  EventDateSummary,
  TicketSelectorProps,
} from "@/features/event-details/types/event-details.types";

const isDateAvailable = (date: EventDateSummary) =>
  date.availableTickets > 0 && date.statusId !== 3;

const TicketSelector = ({ eventId, dates }: TicketSelectorProps) => {
  return (
    <div className="sticky top-28 bg-card/40 backdrop-blur-xl rounded-4xl border py-6 shadow-xs">
      <CardHeader className="mb-3 pl-8">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Ticket className="size-7 text-primary" />
          Ingressos
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {dates.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma data disponível para este evento ainda.
          </p>
        )}

        {dates.map((date) => {
          const available = isDateAvailable(date);

          const card = (
            <div
              className={cn(
                "rounded-xl border p-4 transition-all shadow-xs bg-card/50",
                available
                  ? "hover:scale-95 duration-400 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-foreground capitalize">
                    <CalendarDays className="size-4 text-primary" />
                    {formatDate(date.start)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(date.start)}
                    {date.end ? ` — ${formatTime(date.end)}` : ""}
                  </p>
                  {!available && (
                    <p className="text-xs font-semibold text-destructive mt-1">
                      Esgotado
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  {date.startingPrice !== null && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        A partir de
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(date.startingPrice)}
                      </p>
                    </>
                  )}
                  {available && (
                    <ChevronRight className="size-5 text-primary" />
                  )}
                </div>
              </div>
            </div>
          );

          if (!available) {
            return <div key={date.eventDateId}>{card}</div>;
          }

          return (
            <Link
              key={date.eventDateId}
              to={`/evento/${eventId}/fila`}
              state={{ eventDateId: date.eventDateId }}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              {card}
            </Link>
          );
        })}
      </CardContent>
    </div>
  );
};

export default TicketSelector;
