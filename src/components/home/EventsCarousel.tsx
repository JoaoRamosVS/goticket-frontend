import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "../ui/event-card";
import type { EventMinDTO } from "@/types";

type EventsCarouselProps = {
    title: string;
    events: EventMinDTO[];
};

const GAP_PX = 20;
const DRAG_THRESHOLD_PX = 56;

function getVisibleCount(width: number): number {
    if (width < 640) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 4;
}

const EventsCarousel = ({ title, events }: EventsCarouselProps) => {
    const total = events.length;

    const viewportRef = useRef<HTMLDivElement>(null);
    const dragStartXRef = useRef(0);
    const dragActiveRef = useRef(false);

    const [viewportWidth, setViewportWidth] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (!el) return;

        const measure = () => setViewportWidth(el.clientWidth);
        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const visibleCount = useMemo(() => getVisibleCount(viewportWidth), [viewportWidth]);

    const cardWidthPx = useMemo(() => {
        if (viewportWidth <= 0 || visibleCount <= 0) return 0;
        return (viewportWidth - GAP_PX * (visibleCount - 1)) / visibleCount;
    }, [viewportWidth, visibleCount]);

    const totalPages = Math.max(1, Math.ceil(total / visibleCount));
    const canScroll = total > visibleCount;

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages - 1));
    }, [totalPages]);

    const startIndex =
        currentPage === totalPages - 1
            ? Math.max(0, total - visibleCount)
            : currentPage * visibleCount;

    const baseTranslatePx =
        cardWidthPx > 0 ? -startIndex * (cardWidthPx + GAP_PX) : 0;

    const trackTranslatePx = baseTranslatePx + dragX;

    const isFirst = currentPage === 0;
    const isLast = currentPage >= totalPages - 1;

    const goNext = useCallback(() => {
        setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
    }, [totalPages]);

    const goPrev = useCallback(() => {
        setCurrentPage((p) => Math.max(p - 1, 0));
    }, []);

    const endDrag = (clientX: number, el: HTMLElement, pointerId: number) => {
        if (!dragActiveRef.current) return;
        dragActiveRef.current = false;
        setIsDragging(false);
        const dx = clientX - dragStartXRef.current;
        try {
            el.releasePointerCapture(pointerId);
        } catch { /* noop */ }

        setIsAnimating(true);
        setDragX(0);

        if (dx < -DRAG_THRESHOLD_PX) {
            goNext();
        } else if (dx > DRAG_THRESHOLD_PX) {
            goPrev();
        }
    };

    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.button !== 0 || !canScroll) return;
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
        } catch { /* noop */ }
    };

    const navBtnClass =
        "cursor-pointer rounded-full p-2.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:brightness-110 hover:shadow-xl disabled:opacity-30 disabled:cursor-default";

    return (
        <section className="container mx-auto relative w-full px-2 py-8 sm:px-8 lg:px-4">
            <div className="mb-2 flex items-center justify-between px-2">
                <h2 className="text-left text-2xl tracking-wide font-extrabold sm:text-3xl md:text-4xl">
                    {title}
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Página anterior"
                        onClick={goPrev}
                        disabled={!canScroll || isFirst}
                        className={navBtnClass}
                        style={{
                            background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow: "0 4px 14px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
                        }}
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    <button
                        type="button"
                        aria-label="Próxima página"
                        onClick={goNext}
                        disabled={!canScroll || isLast}
                        className={navBtnClass}
                        style={{
                            background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow: "0 4px 14px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.25)",
                        }}
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            </div>

            <div
                ref={viewportRef}
                className={`relative overflow-hidden py-4 ${
                    isDragging ? "touch-pan-y select-none" : "touch-pan-y"
                }`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
            >
                <div
                    className={`flex ${
                        isAnimating
                            ? "transition-transform duration-500 ease-out"
                            : ""
                    }`}
                    style={{
                        gap: GAP_PX,
                        transform: `translate3d(${trackTranslatePx}px, 0, 0)`,
                        willChange: isAnimating ? "transform" : "auto",
                    }}
                >
                    {events.map((event) => (
                        <div
                            key={event.eventID}
                            style={{
                                width: cardWidthPx > 0 ? cardWidthPx : undefined,
                                flex: "0 0 auto",
                            }}
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsCarousel;
