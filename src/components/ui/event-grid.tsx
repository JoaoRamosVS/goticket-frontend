import { cn } from "@/lib/utils";
import EventCard from "@/components/ui/event-card";
import type { EventMinDTO } from "@/types";

type EventGridProps = {
    events: EventMinDTO[];
    className?: string;
};

const EventGrid = ({ events, className }: EventGridProps) => (
    <div
        className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3",
            className
        )}
    >
        {events.map((event) => (
            <EventCard key={event.eventID} event={event} />
        ))}
    </div>
);

export default EventGrid;
