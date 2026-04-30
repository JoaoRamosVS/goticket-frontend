import type { EditableSector } from "@/features/admin/admin-spaces/types/VenueMapEditor.types";

type VenueMapSidebarProps = {
    sectors: EditableSector[];
    selectedSectorId: string | null;
    selectedSector: EditableSector | null;
    onSelectSector: (localId: string) => void;
    onUpdateSelectedSector: (patch: Partial<EditableSector>) => void;
    onRemoveSelectedSector: () => void;
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
    <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
            {label}
        </span>
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full rounded-xl border border-white/70 bg-white px-3 text-sm text-[#00334d]"
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
}: VenueMapSidebarProps) => (
    <div className="rounded-2xl border border-white/70 bg-white/50 p-3">
        <div className="mb-2 max-h-[420px] overflow-y-auto pr-1">
            {sectors.map((sector) => (
                <button
                    key={sector.localId}
                    type="button"
                    onClick={() => onSelectSector(sector.localId)}
                    className={`mb-2 w-full rounded-xl border px-3 py-2 text-left text-sm ${
                        selectedSectorId === sector.localId
                            ? "border-[#2a8fd4] bg-[#e5f1ff]"
                            : "border-white/70 bg-white/70"
                    }`}
                >
                    <p className="font-semibold text-[#00334d]">{sector.name}</p>
                    <p className="text-xs text-[#5e6c87]">{sector.mapElementId}</p>
                </button>
            ))}
        </div>

        {selectedSector && (
            <div className="space-y-2">
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
                    label="Map Element ID"
                    value={selectedSector.mapElementId}
                    onChange={(value) => onUpdateSelectedSector({ mapElementId: value })}
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
                <button
                    type="button"
                    onClick={onRemoveSelectedSector}
                    className="mt-1 w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                >
                    Remover setor selecionado
                </button>
            </div>
        )}
    </div>
);

export default VenueMapSidebar;
