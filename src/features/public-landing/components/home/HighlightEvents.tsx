import EventCardLarge from "@/components/ui/event-card-large";
import type { EventMinDTO } from "@/types";

type HighlightEventsProps = {
    title: string;
    events: EventMinDTO[];
};

const HIGHLIGHT_LIMIT = 4;

const HighlightEvents = ({ title, events }: HighlightEventsProps) => {
    const highlights = events.slice(0, HIGHLIGHT_LIMIT);

    if (highlights.length === 0) return null;

    return (
        <section className="container mx-auto relative w-full px-2 py-16 sm:px-8 lg:px-4">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(87,197,244,0.07) 0%, rgba(159,210,234,0.04) 40%, transparent 70%)",
                }}
            />

            <h2 className="mb-10 text-center text-3xl tracking-wide font-extrabold sm:text-4xl md:text-5xl px-2">
                {title}
            </h2>

            <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 px-2 sm:px-0">
                {highlights.map((event) => (
                    <EventCardLarge key={event.eventID} event={event} />
                ))}
            </div>
        </section>
    );
};

export default HighlightEvents;
