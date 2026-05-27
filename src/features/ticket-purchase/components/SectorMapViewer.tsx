import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Line, Stage } from "react-konva";
import { Map as MapIcon } from "lucide-react";
import { formatCurrency } from "@/features/event-details/utils/helpers";
import { isSectorAvailable } from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type { ParsedSectorMap } from "@/features/ticket-purchase/utils/sector-map.helpers";
import type { EventDateSectorOption } from "@/features/ticket-purchase/types/ticket-purchase.types";

type SectorMapViewerProps = {
    map: ParsedSectorMap;
    sectors: EventDateSectorOption[];
    selectedSectorId: number | null;
    hoveredSectorId: number | null;
    onSelectSector: (sectorId: number) => void;
    onHoverSector: (sectorId: number | null) => void;
};

type PolygonRender = {
    mapElementId: string;
    points: number[];
    sector: EventDateSectorOption | null;
    available: boolean;
};

const FILL_AVAILABLE = "#3b9adb";
const FILL_HOVER = "#1c6fb5";
const FILL_SELECTED = "#0f4f87";
const FILL_DISABLED = "#94a3b8";
const STROKE_DEFAULT = "#0f1f33";

const SectorMapViewer = ({
    map,
    sectors,
    selectedSectorId,
    hoveredSectorId,
    onSelectSector,
    onHoverSector,
}: SectorMapViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null);

    const sectorsByMapElementId = useMemo(() => {
        const result = new Map<string, EventDateSectorOption>();
        for (const sector of sectors) {
            if (!sector.mapElementId) continue;
            result.set(sector.mapElementId, sector);
        }
        return result;
    }, [sectors]);

    const polygons = useMemo<PolygonRender[]>(() => {
        return map.polygons.map((polygon) => {
            const sector =
                sectorsByMapElementId.get(polygon.mapElementId) ?? null;
            return {
                mapElementId: polygon.mapElementId,
                points: polygon.points,
                sector,
                available: sector ? isSectorAvailable(sector) : false,
            };
        });
    }, [map.polygons, sectorsByMapElementId]);

    useEffect(() => {
        if (!map.baseImageUrl) {
            setBaseImage(null);
            return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => setBaseImage(img);
        img.onerror = () => setBaseImage(null);
        img.src = map.baseImageUrl;
    }, [map.baseImageUrl]);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const update = () => {
            setContainerWidth(node.clientWidth);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const scale = containerWidth > 0 ? containerWidth / map.mapSize.w : 1;
    const stageWidth = map.mapSize.w * scale;
    const stageHeight = map.mapSize.h * scale;

    const hoveredSector =
        hoveredSectorId !== null
            ? sectors.find((s) => s.eventDateSectorId === hoveredSectorId) ??
              null
            : null;

    return (
        <section className="rounded-4xl border bg-white/60 backdrop-blur-xl p-6 md:p-7 shadow-xs">
            <header className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <MapIcon className="size-5" />
                </span>
                <div>
                    <h2 className="text-xl font-bold">Mapa de setores</h2>
                    <p className="text-sm text-muted-foreground">
                        Passe o mouse sobre uma área e clique para selecionar o setor.
                    </p>
                </div>
            </header>

            <div
                ref={containerRef}
                className="relative w-full overflow-hidden rounded-2xl border bg-background/40"
                style={{
                    aspectRatio: `${map.mapSize.w} / ${map.mapSize.h}`,
                }}
            >
                {containerWidth > 0 && (
                    <Stage
                        width={stageWidth}
                        height={stageHeight}
                        scaleX={scale}
                        scaleY={scale}
                    >
                        <Layer>
                            {baseImage && (
                                <KonvaImage
                                    image={baseImage}
                                    x={0}
                                    y={0}
                                    width={map.mapSize.w}
                                    height={map.mapSize.h}
                                    listening={false}
                                />
                            )}

                            {polygons.map((polygon) => {
                                const sectorId =
                                    polygon.sector?.eventDateSectorId ?? null;
                                const isSelected =
                                    sectorId !== null &&
                                    sectorId === selectedSectorId;
                                const isHovered =
                                    sectorId !== null &&
                                    sectorId === hoveredSectorId;

                                let fill = FILL_AVAILABLE;
                                let opacity = 0.32;

                                if (!polygon.available) {
                                    fill = FILL_DISABLED;
                                    opacity = 0.4;
                                } else if (isSelected) {
                                    fill = FILL_SELECTED;
                                    opacity = 0.7;
                                } else if (isHovered) {
                                    fill = FILL_HOVER;
                                    opacity = 0.6;
                                }

                                const handleEnter = (
                                    event: {
                                        target: {
                                            getStage: () => {
                                                container: () => HTMLDivElement | null;
                                            } | null;
                                        };
                                    }
                                ) => {
                                    if (!polygon.available || sectorId === null) return;
                                    onHoverSector(sectorId);
                                    const container = event.target
                                        .getStage()
                                        ?.container();
                                    if (container) {
                                        container.style.cursor = "pointer";
                                    }
                                };

                                const handleLeave = (event: {
                                    target: {
                                        getStage: () => {
                                            container: () => HTMLDivElement | null;
                                        } | null;
                                    };
                                }) => {
                                    onHoverSector(null);
                                    const container = event.target
                                        .getStage()
                                        ?.container();
                                    if (container) {
                                        container.style.cursor = "default";
                                    }
                                };

                                return (
                                    <Group key={polygon.mapElementId}>
                                        <Line
                                            points={polygon.points}
                                            closed
                                            fill={fill}
                                            opacity={opacity}
                                            stroke={STROKE_DEFAULT}
                                            strokeWidth={
                                                isSelected
                                                    ? 3
                                                    : isHovered
                                                    ? 2
                                                    : 1
                                            }
                                            listening={polygon.available}
                                            onMouseEnter={handleEnter}
                                            onMouseLeave={handleLeave}
                                            onClick={() => {
                                                if (
                                                    !polygon.available ||
                                                    sectorId === null
                                                ) {
                                                    return;
                                                }
                                                onSelectSector(sectorId);
                                            }}
                                            onTap={() => {
                                                if (
                                                    !polygon.available ||
                                                    sectorId === null
                                                ) {
                                                    return;
                                                }
                                                onSelectSector(sectorId);
                                            }}
                                        />
                                    </Group>
                                );
                            })}
                        </Layer>
                    </Stage>
                )}

                {hoveredSector && (
                    <div className="pointer-events-none absolute left-3 top-3 max-w-[220px] rounded-xl border bg-background/85 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
                        <p className="font-bold text-foreground">
                            {hoveredSector.name}
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                            {hoveredSector.availableTickets} disponíveis
                        </p>
                        {hoveredSector.startingPrice !== null && (
                            <p className="mt-0.5 font-semibold text-primary">
                                A partir de {formatCurrency(hoveredSector.startingPrice)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 rounded-sm"
                        style={{ backgroundColor: FILL_AVAILABLE, opacity: 0.55 }}
                    />
                    Disponível
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 rounded-sm"
                        style={{ backgroundColor: FILL_SELECTED, opacity: 0.85 }}
                    />
                    Selecionado
                </span>
                <span className="flex items-center gap-1.5">
                    <span
                        className="size-3 rounded-sm"
                        style={{ backgroundColor: FILL_DISABLED, opacity: 0.6 }}
                    />
                    Esgotado
                </span>
            </div>
        </section>
    );
};

export default SectorMapViewer;
