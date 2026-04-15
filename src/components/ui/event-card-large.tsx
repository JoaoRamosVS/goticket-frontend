import { Calendar, MapPin, ArrowRight } from "lucide-react"

type Event = {
    id: number;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    minPrice: number;
}

const EventCardLarge = ({ event }: { event: Event }) => {
  return (
    <article
        key={event.id}
        className="group relative overflow-hidden rounded-[48px] border border-white/60 bg-white/25 p-5 shadow-4xl backdrop-blur-2xl transition-all duration-500 hover:shadow-xl hover:bg-white/60"
        style={{
            boxShadow:
                "0 8px 32px -8px rgba(0,46,71,0.10), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.7)",
        }}
    >
        <div className="overflow-hidden rounded-[28px] shadow-2xl">
            <img
                src={event.imageUrl}
                alt={event.title}
                className="aspect-16/8 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable={false}
            />
        </div>

        <div className="mt-5 flex flex-col gap-2.5 px-3">
            <h3 className="text-xl font-bold sm:text-2xl">
                {event.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-[#5e6c87]">
                <Calendar className="size-4 shrink-0 text-[#7ebad6]" />
                <span>{event.date}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#5e6c87]">
                <MapPin className="size-4 shrink-0 text-[#7ebad6]" />
                <span>{event.location}</span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-lg text-[#5e6c87]">
                    a partir de
                    <strong className="text-base font-extrabold text-accent-foreground ml-1">
                        R${event.minPrice.toFixed(2).replace(".", ",")}
                    </strong>
                </span>

                <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-8 py-2.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        boxShadow:
                            "0 4px 14px -3px rgba(42,143,212,0.45), 0 1px 3px rgba(42,143,212,0.2)",
                    }}
                >
                    Ver detalhes
                    <ArrowRight className="size-4" />
                </button>
            </div>
        </div>
    </article>
  )
}

export default EventCardLarge