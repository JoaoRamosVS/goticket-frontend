import { CalendarPlus2, Trash2 } from "lucide-react";

import type { NewEventFormState } from "@/features/organizer/organizer-new-event/types/newEvent.types";
import {
    Field,
    StepTextInput,
} from "@/features/organizer/organizer-new-event/components/stepShared";

type StepDatesProps = {
    form: NewEventFormState;
    onAdd: () => void;
    onUpdate: (id: string, field: "startDate" | "endDate", value: string) => void;
    onRemove: (id: string) => void;
};

export const StepDates = ({ form, onAdd, onUpdate, onRemove }: StepDatesProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-[#00334d]">
                        Datas e sessões
                    </p>
                    <p className="text-[12px] text-[#5e6c87]">
                        Adicione cada apresentação separadamente. Você pode incluir
                        múltiplas sessões para o mesmo evento.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        boxShadow:
                            "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                    }}
                >
                    <CalendarPlus2 className="size-4" strokeWidth={2.6} />
                    Adicionar data
                </button>
            </div>

            {form.eventDates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-8 text-center text-sm text-[#5e6c87]">
                    Nenhuma data adicionada ainda. Clique em <strong>Adicionar data</strong>
                    para começar.
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {form.eventDates.map((date, index) => (
                        <li
                            key={date.id}
                            className="rounded-2xl border border-white/70 bg-white/55 p-4 backdrop-blur-xl"
                            style={{
                                boxShadow:
                                    "0 4px 14px -6px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                            }}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                    Sessão #{index + 1}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => onRemove(date.id)}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-red-500 transition-all duration-300 hover:bg-red-500/10"
                                    aria-label="Remover sessão"
                                    title="Remover sessão"
                                >
                                    <Trash2 className="size-3.5" strokeWidth={2.4} />
                                </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field
                                    label="Início"
                                    htmlFor={`start-${date.id}`}
                                    required
                                >
                                    <StepTextInput
                                        id={`start-${date.id}`}
                                        type="datetime-local"
                                        value={date.startDate}
                                        onChange={(e) =>
                                            onUpdate(
                                                date.id,
                                                "startDate",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Término"
                                    htmlFor={`end-${date.id}`}
                                    required
                                >
                                    <StepTextInput
                                        id={`end-${date.id}`}
                                        type="datetime-local"
                                        value={date.endDate}
                                        onChange={(e) =>
                                            onUpdate(
                                                date.id,
                                                "endDate",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
