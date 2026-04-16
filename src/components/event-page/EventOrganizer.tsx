import { Star, Users, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventOrganizerInfo } from "./types";

interface EventOrganizerProps {
  organizer: EventOrganizerInfo;
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
  return n.toString();
}

const EventOrganizer = ({ organizer }: EventOrganizerProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Organizador
      </h2>

      <div className="rounded-xl border p-5 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={organizer.avatar}
            alt={organizer.name}
            className="size-14 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-lg truncate">
              {organizer.name}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                {organizer.rating}
              </span>
              <span className="flex items-center gap-1">
                <CalendarCheck className="size-3.5" />
                {organizer.totalEvents} eventos
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {formatNumber(organizer.followers)} seguidores
              </span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {organizer.description}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Seguir
          </Button>
          <Button variant="ghost" className="flex-1">
            Ver perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventOrganizer;
