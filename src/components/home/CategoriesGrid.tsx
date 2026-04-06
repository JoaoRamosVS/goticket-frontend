import { ArrowRight } from "lucide-react";

const CATEGORIES = [
    {
        id: 1,
        name: "Música",
        image:
            "https://media.istockphoto.com/id/1471448614/photo/crowd-of-people-dancing-at-a-music-show-in-barcelona-during-the-summer-of-2022.jpg?s=612x612&w=0&k=20&c=FpGZq6p-1Gqx1JHN-mgapyQhLlvtNGr2M-hxm7mSvt0=",
    },
    {
        id: 2,
        name: "Cinema",
        image:
            "https://s2-oglobo.glbimg.com/OxdUPWTc-_vH9sMLvgf9bhc-dCo=/0x0:1280x841/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/n/6/dUIzAeQSKl1Fy3JuziFg/whatsapp-image-2024-08-20-at-18.40.28.jpeg",
    },
    {
        id: 3,
        name: "Teatro",
        image:
            "https://humanidades.com/wp-content/uploads/2018/10/teatro-5-e1583803340193.jpg",
    },
    {
        id: 4,
        name: "Eventos",
        image:
            "https://img.freepik.com/fotos-gratis/deliciosa-comida-de-rua-natureza-morta_23-2151535346.jpg?semt=ais_hybrid&w=740&q=80",
    },
]

const CategoryCard = ({ category }: { category: typeof CATEGORIES[0] }) => {
    return (
        <div className="relative min-h-[250px] overflow-hidden rounded-[28px] shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300">
            <img
                src={category.image}
                alt=""
                className="absolute inset-0 size-full object-cover brightness-85"
                loading="lazy"
            />
            {[
                { blur: 1, stop: "90%" },
                { blur: 2, stop: "75%" },
                { blur: 4, stop: "60%" },
                { blur: 8, stop: "45%" },
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
            <div className="relative z-10 flex min-h-[250px] items-end p-5">
                <div className="flex items-center justify-center gap-2">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                        {category.name}
                    </h3>
                    <ArrowRight className="size-5 text-white" strokeWidth={4} />
                </div>
            </div>
        </div>
    );
};

const CategoriesGrid = () => {
  return (
    <section className="container mx-auto relative w-full px-2 py-16 sm:px-8 lg:px-4">
        <h2 className="mb-10 text-center text-3xl tracking-wide font-extrabold sm:text-4xl md:text-5xl px-2">
            O que você busca hoje?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pt-8">
            {CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    </section>
  )
}

export default CategoriesGrid