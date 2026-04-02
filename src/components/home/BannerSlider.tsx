import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ChevronRight as ArrowIcon } from "lucide-react";

type BannerItem = {
    id: number;
    title: string;
    date: string;
    location: string;
    cta: string;
    imageUrl: string;
};

const BANNERS: BannerItem[] = [
    {
        id: 1,
        title: "GoTicket Music Festival – São Paulo",
        date: "12 de Junho de 2024",
        location: "Allianz Parque, São Paulo, SP",
        cta: "Garanta seu ingresso",
        imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 2,
        title: "Tech Summit – Inovação e Futuro",
        date: "25 de Julho de 2024",
        location: "Expo Center Norte, São Paulo, SP",
        cta: "Ver Agenda",
        imageUrl:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 3,
        title: "Rock in Concert – Edição Especial",
        date: "18 de Agosto de 2024",
        location: "Pedreira Paulo Leminski, Curitiba, PR",
        cta: "Reservar Lugar",
        imageUrl:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80",
    },
];

const TRANSITION_MS = 700;
const AUTOPLAY_MS = 5500;
const SLIDE_WIDTH_RATIO = 0.76;
const GAP_PX = 12;
const DRAG_THRESHOLD_PX = 56;

function getRealBannerIndex(currentIndex: number, total: number): number {
    if (currentIndex === 0) return total - 1;
    if (currentIndex === total + 1) return 0;
    return currentIndex - 1;
}

const BannerSlider = () => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const dragStartXRef = useRef(0);
    const dragActiveRef = useRef(false);

    const [viewportWidth, setViewportWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [dragX, setDragX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const slides = useMemo(
        () => [
            BANNERS[BANNERS.length - 1],
            ...BANNERS,
            BANNERS[0],
        ],
        []
    );

    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const measure = () => setViewportWidth(el.clientWidth);
        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const slideWidthPx =
        viewportWidth > 0 ? Math.round(viewportWidth * SLIDE_WIDTH_RATIO) : 0;

    const baseTranslatePx =
        viewportWidth > 0 && slideWidthPx > 0
            ? (viewportWidth - slideWidthPx) / 2 -
              currentIndex * (slideWidthPx + GAP_PX)
            : 0;

    const trackTranslatePx = baseTranslatePx + dragX;

    const activeDotIndex = getRealBannerIndex(currentIndex, BANNERS.length);

    const goNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIsAnimating(true);
        setCurrentIndex((i) => i + 1);
    }, [isTransitioning]);

    const goPrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIsAnimating(true);
        setCurrentIndex((i) => i - 1);
    }, [isTransitioning]);

    const goToBanner = useCallback(
        (bannerIndex: number) => {
            if (isTransitioning) return;
            const target = bannerIndex + 1;
            if (target === currentIndex) return;
            setIsTransitioning(true);
            setIsAnimating(true);
            setCurrentIndex(target);
        },
        [currentIndex, isTransitioning]
    );

    useEffect(() => {
        if (isPaused) return;
        const id = window.setInterval(() => {
            goNext();
        }, AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [isPaused, goNext]);

    useEffect(() => {
        if (!isTransitioning) return;
        const id = window.setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
        return () => window.clearTimeout(id);
    }, [isTransitioning]);

    useEffect(() => {
        if (currentIndex !== 0 && currentIndex !== BANNERS.length + 1) return;

        const id = window.setTimeout(() => {
            setIsAnimating(false);
            setCurrentIndex(
                currentIndex === 0 ? BANNERS.length : 1
            );
        }, TRANSITION_MS);

        return () => window.clearTimeout(id);
    }, [currentIndex]);

    useEffect(() => {
        if (!isAnimating) {
            const raf = requestAnimationFrame(() => setIsAnimating(true));
            return () => cancelAnimationFrame(raf);
        }
    }, [isAnimating]);

    const endDrag = (clientX: number, el: HTMLElement, pointerId: number) => {
        if (!dragActiveRef.current) return;
        dragActiveRef.current = false;
        setIsDragging(false);
        const dx = clientX - dragStartXRef.current;
        try {
            el.releasePointerCapture(pointerId);
        } catch {
            /* ignore */
        }

        setIsAnimating(true);

        if (dx < -DRAG_THRESHOLD_PX) {
            setDragX(0);
            goNext();
        } else if (dx > DRAG_THRESHOLD_PX) {
            setDragX(0);
            goPrev();
        } else {
            setDragX(0);
        }
    };

    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 || isTransitioning) return;
        if ((e.target as HTMLElement).closest("button")) return;

        dragActiveRef.current = true;
        setIsDragging(true);
        dragStartXRef.current = e.clientX;
        setDragX(0);
        setIsAnimating(false);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragActiveRef.current) return;
        setDragX(e.clientX - dragStartXRef.current);
    };

    const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
        endDrag(e.clientX, e.currentTarget, e.pointerId);
    };

    const onPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragActiveRef.current) return;
        dragActiveRef.current = false;
        setIsDragging(false);
        setDragX(0);
        setIsAnimating(true);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    };

    return (
        <section
            className="relative w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative">
                <div
                    ref={viewportRef}
                    className={`relative min-h-[280px] overflow-hidden py-6 sm:min-h-[320px] ${
                        isDragging ? "touch-pan-y select-none" : "touch-pan-y"
                    }`}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                >
                    <div
                        className={`flex ${
                            isAnimating ? "transition-transform duration-700 ease-out" : ""
                        }`}
                        style={{
                            gap: GAP_PX,
                            transform: `translate3d(${trackTranslatePx}px, 0, 0)`,
                            willChange: isAnimating ? "transform" : "auto",
                        }}
                    >
                        {slides.map((banner, index) => {
                            const isActive = index === currentIndex;

                            return (
                                <article
                                    key={`${banner.id}-${index}`}
                                    style={{
                                        width:
                                            slideWidthPx > 0
                                                ? slideWidthPx
                                                : undefined,
                                        flex: "0 0 auto",
                                    }}
                                    className={`relative min-h-[460px] overflow-hidden shadow-2xl sm:min-h-[620px] rounded-[32px] sm:rounded-[96px] bg-white/20 backdrop-blur-3xl ${
                                        isActive
                                            ? "z-1 scale-100 opacity-100 blur-0"
                                            : "z-0 scale-[0.96] opacity-55 blur-[2px]"
                                    } transition-all duration-700 ease-out hover:scale-95`}
                                >
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="absolute inset-0 size-full object-cover brightness-75"
                                        draggable={false}
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                                        <div
                                            className="flex w-full max-w-xl flex-col gap-4 rounded-[28px] border border-white/16 px-7 py-6 sm:px-10 sm:py-8"
                                            style={{
                                                background: "rgba(255, 255, 255, 0.21)",
                                                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                                backdropFilter: "blur(10px)",
                                                WebkitBackdropFilter: "blur(10px)",
                                            }}
                                        >
                                            <h2 className="text-lg font-bold leading-tight text-white drop-shadow-md sm:text-4xl">
                                                {banner.title}
                                            </h2>

                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-sm sm:text-md text-white/85">
                                                    <Calendar className="size-4 shrink-0" />
                                                    <span>{banner.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm sm:text-md text-white/85">
                                                    <MapPin className="size-4 shrink-0" />
                                                    <span>{banner.location}</span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl px-4 md:px-12 py-2.5 text-md md:text-lg  font-bold text-white shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                                                style={{
                                                    background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                                    boxShadow: "0 4px 14px -3px rgba(42,143,212,0.45)",
                                                }}
                                            >
                                                {banner.cta}
                                                <ArrowIcon className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="pointer-events-none absolute inset-y-0 left-0 z-2 w-16 bg-linear-to-r from-background/80 via-background/20 to-transparent sm:w-24" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-2 w-16 bg-linear-to-l from-background/80 via-background/20 to-transparent sm:w-24" />
                </div>

                <button
                    type="button"
                    aria-label="Banner anterior"
                    onClick={goPrev}
                    disabled={isTransitioning}
                    className="absolute cursor-pointer top-1/2 left-4 z-3 -translate-y-1/2 rounded-full border border-white/40 bg-white/50 p-2.5 text-slate-800 shadow-md backdrop-blur-md transition hover:bg-white/70 disabled:opacity-40 sm:left-10"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <button
                    type="button"
                    aria-label="Próximo banner"
                    onClick={goNext}
                    disabled={isTransitioning}
                    className="absolute cursor-pointer top-1/2 right-4 z-3 -translate-y-1/2 rounded-full border border-white/40 bg-white/50 p-2.5 text-slate-800 shadow-md backdrop-blur-md transition hover:bg-white/70 disabled:opacity-40 sm:right-10"
                >
                    <ChevronRight className="size-5" />
                </button>

                <div
                    className="absolute left-1/2 bottom-12 z-3 mt-6 flex items-center justify-center"
                    role="tablist"
                    aria-label="Slides do banner"
                >
                    <div className="flex items-center justify-center gap-2 py-1 px-4 bg-primary/5 backdrop-blur-xl shadow-2xl rounded-full">
                    {BANNERS.map((banner, index) => {
                        const isActive = activeDotIndex === index;

                        return (
                            <button
                                key={banner.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`Ir para o banner ${index + 1}`}
                                onClick={() => goToBanner(index)}
                                className={`h-3 cursor-pointer rounded-full transition-all shadow-lg ${
                                    isActive
                                        ? "w-8 bg-primary/70"
                                        : "w-3 bg-white"
                                }`}
                            />
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSlider;
