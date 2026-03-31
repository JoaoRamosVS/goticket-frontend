import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerItem = {
    id: number;
    subtitle: string;
    title: string;
    cta: string;
    imageUrl: string;
};

const banners: BannerItem[] = [
    {
        id: 1,
        subtitle: "Summer Festival",
        title: "Os Melhores Eventos Estao Aqui. Nao perca!",
        cta: "Comprar Ingressos",
        imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 2,
        subtitle: "Tech Conference",
        title: "Conecte-se com as maiores inovacoes do mercado.",
        cta: "Ver Agenda",
        imageUrl:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 3,
        subtitle: "Live Concert",
        title: "Uma noite inesquecivel com artistas incriveis.",
        cta: "Reservar Lugar",
        imageUrl:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80",
    },
];

const TRANSITION_MS = 700;
const AUTOPLAY_MS = 5500;

const BannerSlider = () => {
    const slides = useMemo(
        () => [banners[banners.length - 1], ...banners, banners[0]],
        []
    );
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const activeDot = ((currentIndex - 1 + banners.length) % banners.length) + 1;

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleDotClick = (dotIndex: number) => {
        if (isTransitioning || currentIndex === dotIndex) return;
        setIsTransitioning(true);
        setIsAnimating(true);
        setCurrentIndex(dotIndex);
    };

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(handleNext, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [isPaused, isTransitioning]);

    useEffect(() => {
        if (!isTransitioning) return;
        const timer = setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
        return () => clearTimeout(timer);
    }, [isTransitioning]);

    useEffect(() => {
        if (currentIndex === 0) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setCurrentIndex(banners.length);
            }, TRANSITION_MS);
            return () => clearTimeout(timer);
        }

        if (currentIndex === banners.length + 1) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setCurrentIndex(1);
            }, TRANSITION_MS);
            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (!isAnimating) {
            const frame = requestAnimationFrame(() => setIsAnimating(true));
            return () => cancelAnimationFrame(frame);
        }
    }, [isAnimating]);

    return (
        <section
            className="relative w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative overflow-hidden rounded-3xl py-2">
                <div
                    className={`flex gap-4 ${isAnimating ? "transition-transform duration-700 ease-out" : ""}`}
                    style={{
                        transform: `translateX(calc(-${currentIndex * 76}% - ${currentIndex * 1}rem))`,
                    }}
                >
                    {slides.map((banner, index) => {
                        const isActive = index === currentIndex;

                        return (
                            <article
                                key={`${banner.id}-${index}`}
                                className={`relative shrink-0 basis-[76%] overflow-hidden rounded-2xl border border-white/30 min-h-[170px] ${
                                    isActive
                                        ? "scale-100 opacity-100 blur-0"
                                        : "scale-95 opacity-65 blur-[1.5px]"
                                } transition-all duration-700 ease-out`}
                            >
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="absolute inset-0 size-full object-cover"
                                />
                                <div className="absolute inset-0 bg-cyan-200/25" />

                                <div className="absolute inset-x-4 top-3 rounded-xl border border-white/25 bg-white/20 px-4 py-2 text-center backdrop-blur-md">
                                    <p className="text-[11px] font-medium text-slate-700">
                                        {banner.subtitle}
                                    </p>
                                    <h3 className="mx-auto mt-1 max-w-md text-xl leading-tight font-bold text-slate-900">
                                        {banner.title}
                                    </h3>
                                    <button
                                        type="button"
                                        className="mt-2 rounded-full bg-white/75 px-4 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white"
                                    >
                                        {banner.cta}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background/65 via-background/30 to-transparent backdrop-blur-[2px]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background/65 via-background/30 to-transparent backdrop-blur-[2px]" />
            </div>

            <button
                type="button"
                aria-label="Banner anterior"
                onClick={handlePrevious}
                className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full border border-white/35 bg-white/30 p-2 text-slate-700 backdrop-blur-md transition hover:bg-white/45 disabled:opacity-50"
                disabled={isTransitioning}
            >
                <ChevronLeft className="size-4" />
            </button>

            <button
                type="button"
                aria-label="Proximo banner"
                onClick={handleNext}
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full border border-white/35 bg-white/30 p-2 text-slate-700 backdrop-blur-md transition hover:bg-white/45 disabled:opacity-50"
                disabled={isTransitioning}
            >
                <ChevronRight className="size-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
                {banners.map((banner, index) => {
                    const dotIndex = index + 1;
                    const isActive = activeDot === dotIndex;

                    return (
                        <button
                            key={banner.id}
                            type="button"
                            aria-label={`Ir para o banner ${index + 1}`}
                            onClick={() => handleDotClick(dotIndex)}
                            className={`h-2 rounded-full border border-white/60 transition-all ${
                                isActive ? "w-6 bg-white/95" : "w-2 bg-white/45 hover:bg-white/70"
                            }`}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default BannerSlider;
