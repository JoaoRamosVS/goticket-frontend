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
        <section className="relative overflow-hidden rounded-[56px] backdrop-blur-xl shadow-2xl">
            <div
                className="absolute inset-0 bg-cover bg-center brightness-75 blur-sm"
                style={{ backgroundImage: `url(${eventImage})` }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />

            <div className="relative flex flex-col justify-between gap-4 p-6 md:p-12 min-h-[350px]">
                <Link
                    to={backTo}
                    className="inline-flex w-fit items-center gap-2 shadow-2xl rounded-full bg-linear-to-b from-primary to-[#103d97] px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md hover:scale-95 transition-transform duration-200"
                >
                    <ArrowLeft className="size-3.5" />
                    Voltar para o evento
                </Link>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium uppercase text-end tracking-[0.18em] text-white/90">
                            Escolha seus ingressos
                        </p>
                        <h1 className="text-3xl md:text-6xl font-extrabold text-end leading-tight text-white">
                            {eventTitle}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-6 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2 text-white capitalize">
                            <div className="bg-linear-to-r from-primary to-[#2959b9] p-2 rounded-sm">
                                <CalendarDays className="size-4" />
                            </div>
                            {formatDate(startDate)}
                        </span>
                        <span className="inline-flex items-center gap-2 text-white">
                            <div className="bg-linear-to-r from-primary to-[#2959b9] p-2 rounded-sm">
                                <Clock className="size-4" />
                            </div>
                            {formatTime(startDate)}
                            {endDate ? ` — ${formatTime(endDate)}` : ""}
                        </span>
                        {location && (
                            <span className="inline-flex items-center gap-2 text-white">
                                <div className="bg-linear-to-r from-primary to-[#2959b9] p-2 rounded-sm">
                                    <MapPin className="size-4" />
                                </div>
                                {location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDateHeader;
