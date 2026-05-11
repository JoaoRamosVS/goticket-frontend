import { CalendarDays, MapPin } from "lucide-react";

import { buildEventImageUrl, formatEventDate } from "@/utils/events";
import type { OrganizerEventListItemDTO } from "@/features/organizer/organizer-events/types/organizerEvent.types";
import { getStatusVisual } from "@/features/organizer/organizer-events/utils/eventStatus";

type EventStatusCardProps = {
    event: OrganizerEventListItemDTO;
    onOpen: (eventId: number) => void;
};

export const EventStatusCard = ({ event, onOpen }: EventStatusCardProps) => {
    const visual = getStatusVisual(event.statusName);
    const imageUrl = buildEventImageUrl(event.mainImageKey);
    const date = formatEventDate(event.startDate ?? undefined);
    const location = [event.venueName, event.venueCity, event.venueState]
        .filter((part): part is string => Boolean(part && part.trim()))
        .join(", ");

    return (
        <button
            type="button"
            onClick={() => onOpen(event.eventID)}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/70 bg-white/55 text-left transition-all duration-300 hover:scale-[1.01] hover:bg-white/80 hover:shadow-lg"
            style={{
                boxShadow:
                    "0 6px 18px -8px rgba(0,46,71,0.14), inset 0 1px 0 0 rgba(255,255,255,0.8)",
            }}
        >
            <div className="flex items-center gap-3 p-3">
                <div
                    className="size-14 shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white/60"
                    style={{
                        boxShadow:
                            "0 4px 12px -4px rgba(0,46,71,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)",
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#00334d]">
                        {event.title}
                    </p>
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5e6c87]/80">
                        #{event.eventID} · {event.categoryName ?? "Sem categoria"}
                    </p>
                </div>
            </div>

            <div className="space-y-1.5 px-3 pb-3 text-[11px] text-[#5e6c87]">
                {date && (
                    <div className="inline-flex items-center gap-1.5">
                        <CalendarDays
                            className="size-3"
                            strokeWidth={2.4}
                            style={{ color: visual.accent }}
                        />
                        <span className="truncate">{date}</span>
                    </div>
                )}
                {location && (
                    <div className="inline-flex items-center gap-1.5">
                        <MapPin
                            className="size-3"
                            strokeWidth={2.4}
                            style={{ color: visual.accent }}
                        />
                        <span className="truncate">{location}</span>
                    </div>
                )}
            </div>

            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1"
                style={{ background: visual.gradient }}
            />
        </button>
    );
};
