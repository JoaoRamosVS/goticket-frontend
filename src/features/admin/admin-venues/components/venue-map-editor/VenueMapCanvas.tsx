import { useEffect, useRef, useState } from "react";
import { Circle, Group, Image as KonvaImage, Layer, Line, Stage } from "react-konva";

import type { EditableSector, HoveredEdge } from "@/features/admin/admin-venues/types/venueMapEditor.types";

type VenueMapCanvasProps = {
    sectors: EditableSector[];
    selectedSectorId: string | null;
    selectedSector: EditableSector | null;
    hoveredEdge: HoveredEdge | null;
    baseImage: HTMLImageElement | null;
    mapSize: { w: number; h: number };
    onSelectSector: (localId: string) => void;
    onEnterEdge: (edge: HoveredEdge) => void;
    onLeaveEdge: (edge: HoveredEdge) => void;
    onUpdateVertex: (vertexIndex: number, x: number, y: number) => void;
    onInsertVertexInSelectedSector: (x: number, y: number) => void;
    onInsertVertexAtSegment: (sectorLocalId: string, segmentStart: number, x: number, y: number) => void;
    onInsertVertexGeneric: (sectorLocalId: string, sectorPoints: number[], x: number, y: number) => void;
};

const VenueMapCanvas = ({
    sectors,
    selectedSectorId,
    selectedSector,
    hoveredEdge,
    baseImage,
    mapSize,
    onSelectSector,
    onEnterEdge,
    onLeaveEdge,
    onUpdateVertex,
    onInsertVertexInSelectedSector,
    onInsertVertexAtSegment,
    onInsertVertexGeneric,
}: VenueMapCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(Math.floor(entry.contentRect.width));
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Scale the entire Stage so that logical mapSize always fills the container width.
    // All coordinate data (sector.points) stays in the original logical space —
    // only the visual rendering and hit-testing scale together.
    const scale = containerWidth > 0 && mapSize.w > 0 ? containerWidth / mapSize.w : 1;
    const displayH = Math.round(mapSize.h * scale);

    return (
        <div
            ref={containerRef}
            className="overflow-hidden rounded-4xl border border-white/70 bg-white/25 p-2 shadow-lg"
        >
            {!baseImage ? (
                <div className="flex min-h-72 flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#2a8fd4]/30 px-8 py-10">
                        <p className="text-center text-sm font-medium text-[#5e6c87]">
                            Adicione uma imagem ao espaço para vincular os setores
                        </p>
                    </div>
                </div>
            ) : containerWidth > 0 && (
                <Stage
                    width={containerWidth}
                    height={displayH}
                    scaleX={scale}
                    scaleY={scale}
                    className="rounded-xl bg-white"
                >
                    <Layer>
                        {baseImage && (
                            <KonvaImage image={baseImage} x={0} y={0} width={mapSize.w} height={mapSize.h} />
                        )}

                        {sectors.map((sector) => (
                            <Group key={sector.localId}>
                                <Line
                                    points={sector.points}
                                    closed
                                    fill={sector.color}
                                    opacity={selectedSectorId === sector.localId ? 0.55 : 0.3}
                                    stroke="#00334d"
                                    strokeWidth={selectedSectorId === sector.localId ? 3 : 1.5}
                                    onClick={() => onSelectSector(sector.localId)}
                                    onDblClick={(event) => {
                                        onSelectSector(sector.localId);
                                        const pos = event.target.getStage()?.getPointerPosition();
                                        if (!pos) return;
                                        const lx = pos.x / scale;
                                        const ly = pos.y / scale;
                                        if (selectedSectorId === sector.localId) {
                                            onInsertVertexInSelectedSector(lx, ly);
                                            return;
                                        }
                                        onInsertVertexGeneric(sector.localId, sector.points, lx, ly);
                                    }}
                                />

                                {Array.from({ length: Math.floor(sector.points.length / 2) }).map(
                                    (_, segmentStart) => {
                                        const next = (segmentStart + 1) % (sector.points.length / 2);
                                        const segmentPoints = [
                                            sector.points[segmentStart * 2],
                                            sector.points[segmentStart * 2 + 1],
                                            sector.points[next * 2],
                                            sector.points[next * 2 + 1],
                                        ];
                                        const isHovered =
                                            hoveredEdge?.sectorLocalId === sector.localId &&
                                            hoveredEdge.segmentStart === segmentStart;

                                        return (
                                            <Line
                                                key={`${sector.localId}-edge-${segmentStart}`}
                                                points={segmentPoints}
                                                stroke={isHovered ? "#1facc4" : "rgba(0,0,0,0)"}
                                                strokeWidth={isHovered ? 4 : 1}
                                                hitStrokeWidth={16}
                                                lineCap="round"
                                                onMouseEnter={(event) => {
                                                    onEnterEdge({
                                                        sectorLocalId: sector.localId,
                                                        segmentStart,
                                                    });
                                                    const container = event.target.getStage()?.container();
                                                    if (container) container.style.cursor = "pointer";
                                                }}
                                                onMouseLeave={(event) => {
                                                    onLeaveEdge({
                                                        sectorLocalId: sector.localId,
                                                        segmentStart,
                                                    });
                                                    const container = event.target.getStage()?.container();
                                                    if (container) container.style.cursor = "default";
                                                }}
                                                onClick={() => onSelectSector(sector.localId)}
                                                onDblClick={(event) => {
                                                    onSelectSector(sector.localId);
                                                    const pos = event.target.getStage()?.getPointerPosition();
                                                    if (!pos) return;
                                                    onInsertVertexAtSegment(
                                                        sector.localId,
                                                        segmentStart,
                                                        pos.x / scale,
                                                        pos.y / scale,
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                )}
                            </Group>
                        ))}

                        {selectedSector &&
                            Array.from({ length: selectedSector.points.length / 2 }).map((_, index) => {
                                const x = selectedSector.points[index * 2];
                                const y = selectedSector.points[index * 2 + 1];
                                return (
                                    <Circle
                                        key={`${selectedSector.localId}-${index}`}
                                        x={x}
                                        y={y}
                                        radius={8 / scale}
                                        fill="#2a8fd4"
                                        stroke="#fff"
                                        strokeWidth={2 / scale}
                                        draggable
                                        onDragMove={(event) => {
                                            const { x: nextX, y: nextY } = event.target.position();
                                            onUpdateVertex(index, nextX, nextY);
                                        }}
                                    />
                                );
                            })}
                    </Layer>
                </Stage>
            )}
        </div>
    );
};

export default VenueMapCanvas;
