import type { HoveredEdge, VenueMapEditorProps } from "@/features/admin/admin-spaces/types/VenueMapEditor.types";
import { getInsertVertexIndex } from "@/features/admin/admin-spaces/components/venue-map-editor/VenueMapEditor.helper";
import { useVenueMapEditor } from "@/features/admin/admin-spaces/components/venue-map-editor/useVenueMapEditor";
import VenueMapCanvas from "@/features/admin/admin-spaces/components/venue-map-editor/VenueMapCanvas";
import VenueMapSidebar from "@/features/admin/admin-spaces/components/venue-map-editor/VenueMapSidebar";

export const VenueMapEditor = ({ venueId, venue }: VenueMapEditorProps) => {
    const vm = useVenueMapEditor({ venueId, venue });

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
        <div className="rounded-3xl border border-white/70 bg-white/20 p-6 backdrop-blur-xl">
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
                        className="text-xs"
                    />
                    <button
                        type="button"
                        onClick={vm.addSector}
                        className="rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-[#00334d]"
                    >
                        Adicionar setor
                    </button>
                </div>
            </div>

            {vm.error && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-600">
                    {vm.error}
                </div>
            )}
            {vm.success && (
                <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-700">
                    {vm.success}
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
                    onClick={vm.saveSectors}
                    disabled={vm.isSavingSectors}
                    className="rounded-xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#00334d]"
                >
                    {vm.isSavingSectors ? "Salvando..." : "Salvar setores"}
                </button>
                <button
                    type="button"
                    onClick={vm.saveMap}
                    disabled={vm.isSavingMap}
                    className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    }}
                >
                    {vm.isSavingMap ? "Enviando SVG..." : "Gerar e enviar SVG"}
                </button>
            </div>
        </div>
    );
};

export default VenueMapEditor;
