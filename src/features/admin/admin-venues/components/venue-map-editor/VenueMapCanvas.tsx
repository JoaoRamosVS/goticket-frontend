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
}: VenueMapCanvasProps) => (
    <div className="overflow-auto rounded-4xl border border-white/70 bg-white/25 p-2 shadow-lg">
        <Stage
            width={mapSize.w}
            height={mapSize.h}
            className="rounded-xl bg-white"
            style={{ width: mapSize.w, height: mapSize.h }}
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
                                if (selectedSectorId === sector.localId) {
                                    onInsertVertexInSelectedSector(pos.x, pos.y);
                                    return;
                                }
                                onInsertVertexGeneric(sector.localId, sector.points, pos.x, pos.y);
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
                                                pos.x,
                                                pos.y
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
                                radius={8}
                                fill="#2a8fd4"
                                stroke="#fff"
                                strokeWidth={2}
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
    </div>
);

export default VenueMapCanvas;
