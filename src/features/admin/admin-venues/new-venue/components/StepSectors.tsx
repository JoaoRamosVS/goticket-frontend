import { Minus, Plus } from "lucide-react";

import type { NewVenueDraftSector } from "@/features/admin/admin-venues/new-venue/types/newVenue.types";

const inputClass =
    "w-full rounded-xl border border-white/75 bg-white/60 px-3 py-2 text-sm text-[#00334d] shadow-inner backdrop-blur-md outline-none transition-all duration-200 focus:border-[#2a8fd4]/55 focus:bg-white/90";

type Props = {
    sectors: NewVenueDraftSector[];
    onAdd: () => void;
    onRemove: (key: string) => void;
    onUpdate: (key: string, patch: Partial<NewVenueDraftSector>) => void;
};

export function StepSectors({ sectors, onAdd, onRemove, onUpdate }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-[#5e6c87]">
                Defina nome, descrição e capacidade de cada setor.
                Na próxima etapa você posicionará os polígonos sobre a imagem base.
            </p>

            <div className="flex flex-wrap justify-end">
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/50 px-4 py-2 text-xs font-bold text-[#00334d] shadow-[0_6px_24px_-8px_rgba(42,143,212,0.35)] backdrop-blur-xl transition-all duration-200 hover:scale-[0.98] hover:bg-white/80 hover:shadow-[0_10px_28px_-10px_rgba(28,111,181,0.45)]"
                >
                    <Plus className="size-4" strokeWidth={2.5} />
                    Adicionar setor
                </button>
            </div>

            <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
                {sectors.map((s, idx) => (
                    <div
                        key={s.key}
                        className="rounded-2xl border border-white/75 bg-white/25 p-4 shadow-[0_8px_28px_-12px_rgba(0,51,77,0.18)] backdrop-blur-xl transition-all duration-200 hover:shadow-[0_12px_36px_-14px_rgba(42,143,212,0.22)]"
                        style={{
                            boxShadow:
                                "0 8px 28px -12px rgba(0,51,77,0.15), inset 0 1px 0 0 rgba(255,255,255,0.65)",
                        }}
                    >
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#2a8fd4]">
                                Setor {idx + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => onRemove(s.key)}
                                disabled={sectors.length <= 1}
                                className="inline-flex items-center gap-1 rounded-xl border border-red-200/80 bg-red-50/60 px-2.5 py-1 text-[11px] font-bold text-red-700 transition-all duration-200 hover:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <Minus className="size-3.5" />
                                Remover
                            </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-[#5e6c87]">
                                Nome
                                <input
                                    className={`${inputClass} h-10`}
                                    value={s.name}
                                    onChange={(e) =>
                                        onUpdate(s.key, { name: e.target.value })
                                    }
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-[#5e6c87]">
                                Capacidade
                                <input
                                    type="number"
                                    min={1}
                                    className={`${inputClass} h-10`}
                                    value={s.maxCapacity}
                                    onChange={(e) =>
                                        onUpdate(s.key, {
                                            maxCapacity: Number(e.target.value) || 0,
                                        })
                                    }
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase text-[#5e6c87] sm:col-span-2">
                                Descrição
                                <input
                                    className={`${inputClass} h-10`}
                                    value={s.description}
                                    onChange={(e) =>
                                        onUpdate(s.key, { description: e.target.value })
                                    }
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
