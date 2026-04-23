import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EventMinDTO } from "@/types";
import {
    formatEventDate,
    formatEventLocation,
    formatEventStartingPrice,
    getEventMainImage,
} from "@/helpers/events";

type EventCardProps = {
    event: EventMinDTO;
};

const EventCard = ({ event }: EventCardProps) => {
    const navigate = useNavigate();

    const imageUrl = getEventMainImage(event);
    const formattedDate = formatEventDate(event.startDate);
    const formattedLocation = formatEventLocation(event);
    const formattedPrice = formatEventStartingPrice(event);

    return (
        <article
            className="group relative overflow-hidden rounded-[48px] bg-white/25 shadow-4xl backdrop-blur-2xl transition-all duration-500 hover:shadow-4xl hover:bg-white/60"
            style={{
                boxShadow:
                    "0 8px 32px -8px rgba(0,46,71,0.10), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.7)",
            }}
        >
            <div className="overflow-hidden shadow-2xl relative">
                <img
                    src={imageUrl}
                    alt={event.title}
                    className="aspect-8/6 w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                    draggable={false}
                />
                {[
                    { blur: 1, stop: "90%" },
                    { blur: 2, stop: "25%" },
                    { blur: 6, stop: "50%" },
                    { blur: 8, stop: "75%" },
                ].map((layer) => (
                    <div
                        key={layer.blur}
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backdropFilter: `blur(${layer.blur}px)`,
                            WebkitBackdropFilter: `blur(${layer.blur}px)`,
                            maskImage: `linear-gradient(to top, black 0%, transparent ${layer.stop})`,
                            WebkitMaskImage: `linear-gradient(to top, black 0%, transparent ${layer.stop})`,
                        }}
                    />
                ))}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)",
                    }}
                />
                <div className="absolute inset-0 z-10 flex items-end p-5">
                    <h3 className="text-xl font-bold sm:text-2xl text-white drop-shadow-lg">
                        {event.title}
                    </h3>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 px-8 py-8">
                {formattedDate && (
                    <div className="flex items-center gap-2 text-sm text-[#5e6c87]">
                        <Calendar className="size-4 shrink-0 text-[#7ebad6]" />
                        <span>{formattedDate}</span>
                    </div>
                )}

                {formattedLocation && (
                    <div className="flex items-center gap-2 text-sm text-[#5e6c87]">
                        <MapPin className="size-4 shrink-0 text-[#7ebad6]" />
                        <span>{formattedLocation}</span>
                    </div>
                )}
            </div>

            <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center gap-2 px-8 py-4 text-md font-bold text-white shadow-2xl transition-all duration-300 hover:brightness-110 hover:shadow-lg w-full"
                style={{
                    background:
                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    boxShadow:
                        "0 4px 14px -3px rgba(42,143,212,0.45), 0 1px 3px rgba(42,143,212,0.2)",
                }}
                onClick={() => navigate(`/evento`)}
            >
                {formattedPrice
                    ? `Preços a partir de ${formattedPrice}`
                    : "Ver detalhes"}
                <ArrowRight className="size-5" />
            </button>
        </article>
    );
};

export default EventCard;
