import {
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import type { EventDate, EventVenue } from "./types";

interface EventInfoProps {
  category: string;
  title: string;
  date: EventDate;
  venue: EventVenue;
  ageRating: string;
  tags?: string[];
  status: "available" | "sold_out" | "coming_soon" | "cancelled";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EventInfo = ({
  date,
  venue,
}: EventInfoProps) => {

  return (
    <div className="flex flex-col gap-6 bg-card/40 backdrop-blur-xl rounded-4xl border px-8 py-6 shadow-xs">

      <div className="flex flex-col gap-6 text-muted-foreground">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-foreground font-bold">
              {formatDate(date.start)}
            </p>
            {date.start !== date.end && (
              <p className="text-sm">até {formatDate(date.end)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-foreground font-bold">
              {formatTime(date.start)} - {formatTime(date.end)}
            </p>
            {date.doorsOpen && (
              <p className="text-sm">
                Abertura dos portões: {formatTime(date.doorsOpen)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-foreground font-bold">{venue.name}</p>
            <p className="text-sm">
              {venue.address} - {venue.city}, {venue.state}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
