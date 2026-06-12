import type { EditableSector } from "@/features/admin/admin-venues/types/venueMapEditor.types";

type VenueMapSidebarProps = {
    sectors: EditableSector[];
    selectedSectorId: string | null;
    selectedSector: EditableSector | null;
    onSelectSector: (localId: string) => void;
    onUpdateSelectedSector: (patch: Partial<EditableSector>) => void;
    onRemoveSelectedSector: () => void;
    allowSectorCrud?: boolean;
};

const Field = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) => (
    <label className="block mb-8">
        <span className="mb-1 block text-[12px] font-bold uppercase text-[#5e6c87]">
            {label}
        </span>
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full rounded-xl border border-white/70 bg-white px-3 text-sm text-[#00334d shadow-xs"
        />
    </label>
);

const VenueMapSidebar = ({
    sectors,
    selectedSectorId,
    selectedSector,
    onSelectSector,
    onUpdateSelectedSector,
    onRemoveSelectedSector,
    allowSectorCrud = true,
}: VenueMapSidebarProps) => (
    <div className="rounded-4xl border border-white/70 bg-white/50 px-6 shadow-sm flex py-6 flex-col justify-between">
        <div className="overflow-y-auto px-2 pb-6 max-h-[420px]">
            <h3 className="text-lg font-bold text-[#00334d] mb-4">Setores</h3>
            {sectors.map((sector) => {
                const isSelectedSector = sector.localId === selectedSectorId;
                return (
                    <button
                        key={sector.localId}
                        type="button"
                        onClick={() => onSelectSector(sector.localId)}
                        className={`mb-2 w-full rounded-lg cursor-pointer border px-3 py-4 text-left shadow-md text-md border-white/70 bg-white/70 transition-all duration-200 hover:scale-[0.97] hover:shadow-lg`}
                        style={
                            isSelectedSector
                                ? { background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                    boxShadow: "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                }
                                : undefined
                        }
                    >
                        <p className={`font-medium ${isSelectedSector ? "text-white" : "text-[#00334d]"}`}>{sector.name}</p>
                    </button>
                );
            })}
        </div>

        {selectedSector && (
            <div className="space-y-2">
                <div>
                    <Field
                        label="Nome"
                        value={selectedSector.name}
                        onChange={(value) => onUpdateSelectedSector({ name: value })}
                    />
                    <Field
                        label="Descrição"
                        value={selectedSector.description}
                        onChange={(value) => onUpdateSelectedSector({ description: value })}
                    />
                    <Field
                        label="Capacidade"
                        value={String(selectedSector.maxCapacity)}
                        onChange={(value) =>
                            onUpdateSelectedSector({
                                maxCapacity: Number(value) || 0,
                            })
                        }
                    />
                </div>
                {allowSectorCrud && (
                    <button
                        type="button"
                        onClick={onRemoveSelectedSector}
                        className="mt-1 w-full rounded-xl cursor-pointer bg-linear-to-b from-[#cd3a3a] to-[#811010] px-3 py-3 text-sm font-extrabold text-white shadow-2xl transition duration-200 hover:scale-[0.98] hover:from-[#811010] hover:to-[#cd3a3a]"
                    >
                        Remover setor selecionado
                    </button>
                )}
            </div>
        )}
    </div>
);

export default VenueMapSidebar;
