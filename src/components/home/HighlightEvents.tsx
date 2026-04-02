import { Calendar, MapPin, ArrowRight } from "lucide-react";

type HighlightEvent = {
    id: number;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    minPrice: number;
};

const EVENTS: HighlightEvent[] = [
    {
        id: 1,
        title: "Festa Eletrônica com Top DJ",
        date: "20 de abril de 2024",
        location: "Green Valley, Balneário Camboriú, SC",
        imageUrl:
            "https://s2-oglobo.glbimg.com/rcWeBJ56Ic5JOb-hupn_JcNK0JM=/0x0:3078x2048/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/B/D/BkHWS5QSisLV5EBAeEYQ/47-fat-7644.jpg",
        minPrice: 89.9,
    },
    {
        id: 2,
        title: "Peça: A Comédia do Ano",
        date: "30 de abril de 2024",
        location: "Teatro Municipal, Rio de Janeiro, RJ",
        imageUrl:
            "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800&q=80",
        minPrice: 45.0,
    },
];

const HighlightEvents = () => {
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
                Em destaque para você
            </h2>

            <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 px-2 sm:px-0">
                {EVENTS.map((event) => (
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
                ))}
            </div>
        </section>
    );
};

export default HighlightEvents;
