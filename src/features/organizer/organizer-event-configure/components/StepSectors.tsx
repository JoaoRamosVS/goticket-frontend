import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import type { EventConfigureResponse } from "@/features/organizer/organizer-event-configure/types/eventConfigure.types";
import type { VenueSectorDTO } from "@/features/admin/admin-venues/types/venue.types";

type Props = {
    event: EventConfigureResponse;
    venueSectors: VenueSectorDTO[];
    venueSectorsLoading: boolean;
    onAdd: (venueSector: VenueSectorDTO) => Promise<void>;
    onDelete: (sectorId: number) => Promise<void>;
};

export const StepSectors = ({
    event,
    venueSectors,
    venueSectorsLoading,
    onAdd,
    onDelete,
}: Props) => {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const linkedVenueSectorIds = new Set(event.sectors.map((s) => s.venueSectorId));

    const handleAdd = async (venueSector: VenueSectorDTO) => {
        setLoadingId(venueSector.sectorId);
        try {
            await onAdd(venueSector);
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (sectorId: number) => {
        setLoadingId(sectorId);
        try {
            await onDelete(sectorId);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Setores do espaço */}
            <div>
                <h3 className="mb-3 text-sm font-bold text-[#00334d]">
                    Setores disponíveis no espaço
                </h3>

                {venueSectorsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-[#5e6c87]">
                        <Loader2 className="size-4 animate-spin" />
                        Carregando setores...
                    </div>
                ) : venueSectors.length === 0 ? (
                    <p className="text-sm text-[#5e6c87]">
                        Nenhum setor cadastrado neste espaço.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {venueSectors.map((vs) => {
                            const isLinked = linkedVenueSectorIds.has(vs.sectorId);
                            const isLoading = loadingId === vs.sectorId;

                            return (
                                <div
                                    key={vs.sectorId}
                                    className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 px-4 py-3 backdrop-blur-xl shadow-sm"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#00334d]">
                                            {vs.name}
                                        </p>
                                        <p className="text-xs text-[#5e6c87]">
                                            Capacidade: {vs.maxCapacity.toLocaleString("pt-BR")} pessoas
                                        </p>
                                    </div>

                                    {isLinked ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-100/80 px-3 py-1 text-xs font-bold text-green-700">
                                            <CheckCircle2 className="size-3.5" />
                                            Adicionado
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => void handleAdd(vs)}
                                            disabled={isLoading}
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all hover:scale-[0.97] disabled:opacity-50"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                            }}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Plus className="size-3.5" strokeWidth={3} />
                                            )}
                                            Adicionar
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Setores já adicionados ao evento */}
            {event.sectors.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-bold text-[#00334d]">
                        Setores do evento
                    </h3>
                    <div className="flex flex-col gap-2">
                        {event.sectors.map((s) => {
                            const isLinkedToDate = event.eventDates.some((d) =>
                                d.dateSectors.some(
                                    (eds) => eds.venueSectorId === s.venueSectorId
                                )
                            );
                            const isLoading = loadingId === s.sectorId;

                            return (
                                <div
                                    key={s.sectorId}
                                    className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/60 px-4 py-3 backdrop-blur-xl shadow-sm"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#00334d]">
                                            {s.name}
                                        </p>
                                        <p className="text-xs text-[#5e6c87]">
                                            {s.description}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(s.sectorId)}
                                        disabled={isLoading || isLinkedToDate}
                                        title={
                                            isLinkedToDate
                                                ? "Desvincule das datas antes de remover"
                                                : "Remover setor"
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/70 px-3 py-1.5 text-xs font-bold text-red-700 transition-all hover:scale-[0.97] hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-3.5" />
                                        )}
                                        Remover
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
