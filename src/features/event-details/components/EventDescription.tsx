import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventDescriptionProps } from "@/features/event-details/types/event-details.types";

const EventDescription = ({ description }: EventDescriptionProps) => {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-bold mb-4 flex items-center gap-2">
          <Info className="size-8 text-primary" />
          Sobre o Evento
        </h2>
        <div className="relative">
          <div
            className={cn(
              "text-muted-foreground leading-relaxed whitespace-pre-line mt-8 rounded-4xl px-10 py-8 bg-card/45 backdrop-blur-4xl shadow-xs shadow-primary"
            )}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDescription;
