import { useState } from "react";
import { Plus, Trash2, Loader2, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import type {
    EventConfigureResponse,
    EventDateSectorFull,
    CreateTicketBatchPayload,
} from "@/features/event-configure/types/eventConfigure.types";

type Props = {
    event: EventConfigureResponse;
    onCreateBatch: (
        eventDateSectorId: number,
        payload: CreateTicketBatchPayload
    ) => Promise<void>;
    onDeleteBatch: (batchId: number) => Promise<void>;
};

type BatchForm = {
    price: string;
    fullQuota: string;
    halfQuota: string;
    solidaryEnabled: boolean;
    solidaryPrice: string;
    solidaryQuota: string;
};

const emptyForm = (): BatchForm => ({
    price: "",
    fullQuota: "",
    halfQuota: "",
    solidaryEnabled: false,
    solidaryPrice: "",
    solidaryQuota: "",
});

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const SectorBatchPanel = ({
    eventId,
    eds,
    onCreateBatch,
    onDeleteBatch,
}: {
    eventId: number;
    eds: EventDateSectorFull;
    onCreateBatch: Props["onCreateBatch"];
    onDeleteBatch: Props["onDeleteBatch"];
}) => {
    void eventId;
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<BatchForm>(emptyForm());
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        const price = parseFloat(form.price);
        const fullQuota = parseInt(form.fullQuota, 10);
        const halfQuota = parseInt(form.halfQuota, 10);

        if (isNaN(price) || price <= 0) {
            setError("Informe um preço válido.");
            return;
        }
        if (isNaN(fullQuota) || fullQuota < 0) {
            setError("Cota de inteira inválida.");
            return;
        }
        if (isNaN(halfQuota) || halfQuota < 0) {
            setError("Cota de meia-entrada inválida.");
            return;
        }
        if (fullQuota + halfQuota === 0 && !form.solidaryEnabled) {
            setError("O lote precisa ter pelo menos uma cota.");
            return;
        }

        const allotments: CreateTicketBatchPayload["allotments"] = [];
        if (fullQuota > 0) allotments.push({ ticketTypeId: 1, quota: fullQuota });
        if (halfQuota > 0) allotments.push({ ticketTypeId: 2, quota: halfQuota });

        if (form.solidaryEnabled) {
            const sPrice = parseFloat(form.solidaryPrice);
            const sQuota = parseInt(form.solidaryQuota, 10);
            if (isNaN(sPrice) || sPrice < 0) {
                setError("Informe um preço válido para o ingresso solidário.");
                return;
            }
            if (isNaN(sQuota) || sQuota <= 0) {
                setError("Cota solidária deve ser maior que zero.");
                return;
            }
            allotments.push({ ticketTypeId: 3, quota: sQuota, price: sPrice });
        }

        setError(null);
        setSubmitting(true);
        try {
            await onCreateBatch(eds.eventDateSectorId, { price, allotments });
            setForm(emptyForm());
            setOpen(false);
        } catch {
            setError("Não foi possível criar o lote.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (batchId: number) => {
        setDeletingId(batchId);
        try {
            await onDeleteBatch(batchId);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-xl shadow-sm">
            <div className="mb-3">
                <p className="text-sm font-bold text-[#00334d]">{eds.name}</p>
                <p className="text-xs text-[#5e6c87]">
                    {eds.totalTickets > 0
                        ? `${eds.totalTickets.toLocaleString("pt-BR")} ingressos · ${eds.batches.length} lote(s)`
                        : "Nenhum lote configurado"}
                </p>
            </div>

            {/* Lotes existentes */}
            {eds.batches.length > 0 && (
                <div className="mb-3 flex flex-col gap-2">
                    {eds.batches.map((b) => (
                        <div
                            key={b.batchId}
                            className="flex items-start justify-between rounded-xl border border-white/50 bg-white/60 px-3 py-2.5"
                        >
                            <div>
                                <p className="text-xs font-bold text-[#00334d]">
                                    Lote {b.batchNumber} · {formatCurrency(b.price)}
                                </p>
                                <div className="mt-0.5 flex flex-wrap gap-2">
                                    {b.allotments.map((a) => (
                                        <span
                                            key={a.allotmentId}
                                            className="text-[11px] text-[#5e6c87]"
                                        >
                                            {a.ticketTypeName}: {a.quota} (
                                            {formatCurrency(a.effectivePrice)})
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => void handleDelete(b.batchId)}
                                disabled={deletingId === b.batchId || b.soldTickets > 0}
                                title={
                                    b.soldTickets > 0
                                        ? "Lote com vendas não pode ser removido"
                                        : "Remover lote"
                                }
                                className="ml-2 mt-0.5 cursor-pointer rounded-lg border border-red-200/70 bg-red-50/70 p-1.5 text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {deletingId === b.batchId ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="size-3.5" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Toggle form */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-3 py-1.5 text-xs font-bold text-[#2a8fd4] transition-all hover:bg-white/80"
            >
                {open ? (
                    <ChevronUp className="size-3.5" />
                ) : (
                    <Plus className="size-3.5" strokeWidth={3} />
                )}
                {open ? "Cancelar" : "Novo lote"}
            </button>

            {open && (
                <div className="mt-3 rounded-xl border border-white/50 bg-white/60 p-4">
                    {error && (
                        <p className="mb-3 rounded-xl bg-red-50/80 px-3 py-2 text-xs font-semibold text-red-700">
                            {error}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase text-[#5e6c87]">
                                Preço (R$)
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, price: e.target.value }))
                                }
                                className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-[#00334d] outline-none focus:ring-2 focus:ring-[#2a8fd4]/30"
                                placeholder="100.00"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase text-[#5e6c87]">
                                Cota Inteira
                            </span>
                            <input
                                type="number"
                                min="0"
                                value={form.fullQuota}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, fullQuota: e.target.value }))
                                }
                                className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-[#00334d] outline-none focus:ring-2 focus:ring-[#2a8fd4]/30"
                                placeholder="300"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase text-[#5e6c87]">
                                Cota Meia-Entrada
                            </span>
                            <input
                                type="number"
                                min="0"
                                value={form.halfQuota}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, halfQuota: e.target.value }))
                                }
                                className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-[#00334d] outline-none focus:ring-2 focus:ring-[#2a8fd4]/30"
                                placeholder="200"
                            />
                        </label>
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.solidaryEnabled}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    solidaryEnabled: e.target.checked,
                                }))
                            }
                            className="rounded"
                        />
                        <span className="text-xs font-semibold text-[#5e6c87]">
                            Incluir ingresso solidário
                        </span>
                    </label>

                    {form.solidaryEnabled && (
                        <div className="mt-2 grid grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold uppercase text-[#5e6c87]">
                                    Preço Solidário (R$)
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.solidaryPrice}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            solidaryPrice: e.target.value,
                                        }))
                                    }
                                    className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-[#00334d] outline-none focus:ring-2 focus:ring-[#2a8fd4]/30"
                                    placeholder="25.00"
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold uppercase text-[#5e6c87]">
                                    Cota Solidária
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    value={form.solidaryQuota}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            solidaryQuota: e.target.value,
                                        }))
                                    }
                                    className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-[#00334d] outline-none focus:ring-2 focus:ring-[#2a8fd4]/30"
                                    placeholder="50"
                                />
                            </label>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={submitting}
                        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all hover:scale-[0.98] disabled:opacity-50"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        }}
                    >
                        {submitting ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Plus className="size-3.5" strokeWidth={3} />
                        )}
                        {submitting ? "Salvando..." : "Criar lote"}
                    </button>
                </div>
            )}
        </div>
    );
};

export const StepBatches = ({ event, onCreateBatch, onDeleteBatch }: Props) => {
    const allDateSectors = event.eventDates.flatMap((d) => d.dateSectors);

    if (allDateSectors.length === 0) {
        return (
            <p className="text-sm text-[#5e6c87]">
                Vincule setores às datas do evento antes de configurar os lotes.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {event.eventDates.map((date) => {
                if (date.dateSectors.length === 0) return null;
                return (
                    <div key={date.eventDateId}>
                        <div className="mb-3 flex items-center gap-2">
                            <CalendarDays
                                className="size-4 text-[#2a8fd4]"
                                strokeWidth={2}
                            />
                            <p className="text-sm font-bold text-[#00334d]">
                                {formatDate(date.startDate)} → {formatDate(date.endDate)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {date.dateSectors.map((eds) => (
                                <SectorBatchPanel
                                    key={eds.eventDateSectorId}
                                    eventId={event.eventId}
                                    eds={eds}
                                    onCreateBatch={onCreateBatch}
                                    onDeleteBatch={onDeleteBatch}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
