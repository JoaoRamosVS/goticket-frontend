import type { HoveredEdge, VenueMapEditorProps } from "@/features/admin/admin-venues/types/venueMapEditor.types";
import { getInsertVertexIndex } from "@/features/admin/admin-venues/components/venue-map-editor/VenueMapEditor.helper";
import { useVenueMapEditor } from "@/features/admin/admin-venues/components/venue-map-editor/useVenueMapEditor";
import VenueMapCanvas from "@/features/admin/admin-venues/components/venue-map-editor/VenueMapCanvas";
import VenueMapSidebar from "@/features/admin/admin-venues/components/venue-map-editor/VenueMapSidebar";

export const VenueMapEditor = ({
    venueId,
    venue,
    mode = "full",
    onSuccessfulSave,
}: VenueMapEditorProps) => {
    const allowSectorCrud = mode === "full";
    const vm = useVenueMapEditor({ venueId, venue, onSuccessfulSave });

    const insertVertexGeneric = (
        sectorLocalId: string,
        sectorPoints: number[],
        x: number,
        y: number
    ) => {
        const boundedX = Math.max(0, Math.min(vm.mapSize.w, Math.round(x)));
        const boundedY = Math.max(0, Math.min(vm.mapSize.h, Math.round(y)));
        const insertAtVertex = getInsertVertexIndex(sectorPoints, boundedX, boundedY);
        const insertAtPointIndex = insertAtVertex * 2;
        vm.setSectors((prev) =>
            prev.map((item) => {
                if (item.localId !== sectorLocalId) return item;
                const nextPoints = [...item.points];
                nextPoints.splice(insertAtPointIndex, 0, boundedX, boundedY);
                return { ...item, points: nextPoints };
            })
        );
    };

    if (vm.isLoading) {
        return (
            <div className="rounded-3xl border border-white/70 bg-white/20 p-6 text-sm text-[#5e6c87]">
                Carregando editor de mapa...
            </div>
        );
    }

    return (
        <div className="rounded-4xl border border-white/70 bg-white/20 p-6 backdrop-blur-xl shadow-lg">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-[#00334d]">Mapa de setores</h3>
                    <p className="text-xs text-[#5e6c87]">
                        Suba a imagem base, ajuste os polígonos dos setores e gere o SVG final.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => void vm.handleBaseImageUpload(event.target.files?.[0] ?? null)}
                        className="text-xs cursor-pointer text-white bg-linear-to-b from-[#30a5f3] to-[#266ca5] pl-3 py-2 rounded-4xl hover:scale-95 hover:shadow-2xl transition-all duration-200"
                    />
                    {allowSectorCrud && (
                        <button
                            type="button"
                            onClick={vm.addSector}
                            className="cursor-pointer shadow-md rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-accent/50 hover:scale-95 hover:shadow-xl"
                        >
                            Adicionar setor
                        </button>
                    )}
                </div>
            </div>

            {vm.error && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-600">
                    {vm.error}
                </div>
            )}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
                <VenueMapSidebar
                    sectors={vm.sectors}
                    selectedSectorId={vm.selectedSectorId}
                    selectedSector={vm.selectedSector}
                    onSelectSector={vm.setSelectedSectorId}
                    onUpdateSelectedSector={vm.updateSelectedSector}
                    onRemoveSelectedSector={vm.removeSelectedSector}
                    allowSectorCrud={allowSectorCrud}
                />
                
                <VenueMapCanvas
                    sectors={vm.sectors}
                    selectedSectorId={vm.selectedSectorId}
                    selectedSector={vm.selectedSector}
                    hoveredEdge={vm.hoveredEdge}
                    baseImage={vm.baseImage}
                    mapSize={vm.mapSize}
                    onSelectSector={vm.setSelectedSectorId}
                    onEnterEdge={vm.setHoveredEdge}
                    onLeaveEdge={(edge: HoveredEdge) =>
                        vm.setHoveredEdge((current) =>
                            current?.sectorLocalId === edge.sectorLocalId &&
                            current.segmentStart === edge.segmentStart
                                ? null
                                : current
                        )
                    }
                    onUpdateVertex={vm.updateVertex}
                    onInsertVertexInSelectedSector={vm.insertVertexInSelectedSector}
                    onInsertVertexAtSegment={vm.insertVertexAtSegment}
                    onInsertVertexGeneric={insertVertexGeneric}
                />
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                    type="button"
                    onClick={() => void vm.saveVenueMap()}
                    disabled={vm.isSavingVenueMap}
                    className="rounded-xl cursor-pointer px-12 py-2 mt-4 text-md font-bold text-white shadow-2xl hover:scale-105 transition-all duration-200"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    }}
                >
                    {vm.isSavingVenueMap ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
        </div>
    );
};

export default VenueMapEditor;
