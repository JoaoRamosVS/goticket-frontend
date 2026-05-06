import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import {
    formatDate,
    formatTime,
} from "@/features/event-details/utils/helpers";
import type { EventDateHeaderProps } from "@/features/ticket-purchase/types/ticket-purchase.types";

const EventDateHeader = ({
    eventTitle,
    eventImage,
    startDate,
    endDate,
    venueName,
    venueCity,
    venueState,
    backTo,
}: EventDateHeaderProps) => {
    const location = [venueName, venueCity, venueState]
        .filter((part) => part && part.trim().length > 0)
        .join(", ");

    return (
        <section className="relative overflow-hidden rounded-4xl border bg-card/40 backdrop-blur-xl shadow-xs">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${eventImage})` }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/80 to-background/95" />

            <div className="relative flex flex-col gap-4 p-6 md:p-8">
                <Link
                    to={backTo}
                    className="inline-flex w-fit items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5" />
                    Voltar para o evento
                </Link>

                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Escolha seus ingressos
                    </p>
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                        {eventTitle}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 capitalize">
                        <CalendarDays className="size-4 text-primary" />
                        {formatDate(startDate)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        {formatTime(startDate)}
                        {endDate ? ` — ${formatTime(endDate)}` : ""}
                    </span>
                    {location && (
                        <span className="inline-flex items-center gap-2">
                            <MapPin className="size-4 text-primary" />
                            {location}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default EventDateHeader;
