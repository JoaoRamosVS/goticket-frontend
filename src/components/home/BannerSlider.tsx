import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerItem = {
    id: number;
    subtitle: string;
    title: string;
    cta: string;
    imageUrl: string;
};

const BANNERS: BannerItem[] = [
    {
        id: 1,
        subtitle: "Summer Festival",
        title: "Os Melhores Eventos Estão Aqui. Não perca!",
        cta: "Comprar Ingressos",
        imageUrl:
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 2,
        subtitle: "Tech Conference",
        title: "Conecte-se com as maiores inovações do mercado.",
        cta: "Ver Agenda",
        imageUrl:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    },
    {
        id: 3,
        subtitle: "Live Concert",
        title: "Uma noite inesquecível com artistas incríveis.",
        cta: "Reservar Lugar",
        imageUrl:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80",
    },
];

const TRANSITION_MS = 700;
const AUTOPLAY_MS = 5500;
const SLIDE_WIDTH_RATIO = 0.76;
const GAP_PX = 16;
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
                        isDragging ? "cursor-grabbing touch-pan-y select-none" : "cursor-grab touch-pan-y"
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
                                    className={`relative min-h-[260px] overflow-hidden shadow-2xl sm:min-h-[620px] rounded-4xl bg-white/20 backdrop-blur-3xl ${
                                        isActive
                                            ? "z-1 scale-100 opacity-100 blur-0"
                                            : "z-0 scale-[0.96] opacity-55 blur-[2px]"
                                    } transition-all duration-700 ease-out`}
                                >
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="absolute inset-0 size-full object-cover brightness-50 blur-xs"
                                        draggable={false}
                                    />

                                    <p className="text-xs font-medium text-slate-800 sm:text-sm">
                                        {banner.subtitle}
                                    </p>
                                    <h2 className="mx-auto mt-2 max-w-xl text-lg font-bold leading-tight text-slate-900 sm:text-2xl">
                                        {banner.title}
                                    </h2>
                                    <button
                                        type="button"
                                        className="mt-3 rounded-full bg-white/80 px-5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:bg-white sm:text-sm"
                                    >
                                        {banner.cta}
                                    </button>
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
                    className="absolute top-1/2 left-0 z-3 -translate-y-1/2 rounded-full border border-white/40 bg-white/50 p-2.5 text-slate-800 shadow-md backdrop-blur-md transition hover:bg-white/70 disabled:opacity-40 sm:left-2"
                >
                    <ChevronLeft className="size-5" />
                </button>

                <button
                    type="button"
                    aria-label="Próximo banner"
                    onClick={goNext}
                    disabled={isTransitioning}
                    className="absolute top-1/2 right-0 z-3 -translate-y-1/2 rounded-full border border-white/40 bg-white/50 p-2.5 text-slate-800 shadow-md backdrop-blur-md transition hover:bg-white/70 disabled:opacity-40 sm:right-2"
                >
                    <ChevronRight className="size-5" />
                </button>

                <div
                    className="relative z-3 mt-6 flex items-center justify-center"
                    role="tablist"
                    aria-label="Slides do banner"
                >
                    <div className="flex items-center justify-center gap-2 py-1 px-4 bg-primary/10 backdrop-blur-3xl shadow-xl rounded-full">
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
                                        ? "w-8 bg-primary/40"
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
