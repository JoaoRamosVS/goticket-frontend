import EventCardLarge from "@/components/ui/event-card-large";

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
    {
        id: 3,
        title: "Festa Eletrônica com Top DJ",
        date: "20 de abril de 2024",
        location: "Green Valley, Balneário Camboriú, SC",
        imageUrl:
            "https://s2-oglobo.glbimg.com/rcWeBJ56Ic5JOb-hupn_JcNK0JM=/0x0:3078x2048/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/B/D/BkHWS5QSisLV5EBAeEYQ/47-fat-7644.jpg",
        minPrice: 89.9,
    },
    {
        id: 4,
        title: "Peça: A Comédia do Ano",
        date: "30 de abril de 2024",
        location: "Teatro Municipal, Rio de Janeiro, RJ",
        imageUrl:
            "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800&q=80",
        minPrice: 45.0,
    },
];

const HighlightEvents = ({ title }: { title: string }) => {
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
                {EVENTS.map((event) => (
                    <EventCardLarge event={event} />
                ))}
            </div>
        </section>
    );
};

export default HighlightEvents;
