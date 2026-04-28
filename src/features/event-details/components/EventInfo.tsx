import { Calendar, Clock, MapPin } from "lucide-react";
import type { EventInfoProps } from "@/features/event-details/types/event-details.types";
import { formatDate, formatTime, isSameCalendarDay } from "@/features/event-details/utils/helpers";

const EventInfo = ({ date, venue }: EventInfoProps) => {
  
  return (
    <div className="flex flex-col gap-6 bg-card/40 backdrop-blur-xl rounded-4xl border px-8 py-6 shadow-xs">
      <div className="flex flex-col gap-6 text-muted-foreground">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-primary shrink-0" />
          <div>
            <p className="text-foreground font-bold">
              {formatDate(date.start)}
            </p>
            {!isSameCalendarDay(date.start, date.end) && (
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

