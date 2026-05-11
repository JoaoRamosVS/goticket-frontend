import { CalendarDays, Hourglass } from "lucide-react";

import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";
import type { VenueMinDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { NewEventFormState } from "@/features/organizer/organizer-new-event/types/newEvent.types";

type StepReviewProps = {
    form: NewEventFormState;
    categories: EventCategoryDTO[];
    venues: VenueMinDTO[];
};

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

function formatLocal(value: string): string {
    if (!value) return "—";
    const normalized = value.length === 16 ? `${value}:00` : value;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    return DATE_FORMATTER.format(date);
}

export const StepReview = ({ form, categories, venues }: StepReviewProps) => {
    const category =
        categories.find((c) => String(c.categoryId) === form.categoryId) ?? null;
    const venue =
        venues.find((v) => String(v.venueID) === form.venueId) ?? null;

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex items-start gap-3 rounded-2xl border border-amber-300/50 bg-amber-50/60 px-4 py-3 text-sm text-amber-700 backdrop-blur-xl"
                style={{
                    boxShadow:
                        "0 6px 18px -8px rgba(245,158,11,0.25), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                }}
            >
                <Hourglass className="mt-0.5 size-4 shrink-0" strokeWidth={2.6} />
                <p>
                    Ao enviar, o evento será criado com status{" "}
                    <strong>Aguardando aprovação</strong>. Você acompanhará a
                    situação dele no dashboard até a curadoria revisar.
                </p>
            </div>

            <SummaryCard title="Detalhes">
                <ReviewRow label="Título" value={form.title || "—"} />
                <ReviewRow label="Categoria" value={category?.name ?? "—"} />
                <ReviewRow
                    label="Restrição"
                    value={`${form.ageRestriction} anos`}
                />
                <ReviewRow
                    label="Início das vendas"
                    value={form.salesStartDate ? formatLocal(form.salesStartDate) : "Após aprovação"}
                />
                <ReviewRow
                    label="Descrição"
                    value={form.description || "—"}
                    multiline
                />
            </SummaryCard>

            <SummaryCard title="Espaço">
                <ReviewRow label="Nome" value={venue?.name ?? "—"} />
                <ReviewRow label="Razão social" value={venue?.legalName ?? "—"} />
                <ReviewRow
                    label="Local"
                    value={
                        venue
                            ? [venue.city, venue.state, venue.country]
                                  .filter(Boolean)
                                  .join(", ")
                            : "—"
                    }
                />
            </SummaryCard>

            <SummaryCard title="Datas e sessões">
                {form.eventDates.length === 0 ? (
                    <p className="text-sm text-[#5e6c87]">Nenhuma data adicionada.</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {form.eventDates.map((date, index) => (
                            <li
                                key={date.id}
                                className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-3 py-2 text-sm text-[#00334d]"
                                style={{
                                    boxShadow:
                                        "inset 0 1px 0 0 rgba(255,255,255,0.85)",
                                }}
                            >
                                <CalendarDays
                                    className="size-3.5 text-[#2a8fd4]"
                                    strokeWidth={2.6}
                                />
                                <span className="font-bold">#{index + 1}</span>
                                <span className="truncate">
                                    {formatLocal(date.startDate)} →{" "}
                                    {formatLocal(date.endDate)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </SummaryCard>
        </div>
    );
};

type SummaryCardProps = {
    title: string;
    children: React.ReactNode;
};

const SummaryCard = ({ title, children }: SummaryCardProps) => (
    <div
        className="rounded-3xl border border-white/70 bg-white/30 p-5 backdrop-blur-xl"
        style={{
            boxShadow:
                "0 6px 20px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
        }}
    >
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
            {title}
        </p>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

type ReviewRowProps = {
    label: string;
    value: string;
    multiline?: boolean;
};

const ReviewRow = ({ label, value, multiline }: ReviewRowProps) => (
    <div
        className={`flex ${
            multiline ? "flex-col gap-1" : "items-start justify-between gap-3"
        }`}
    >
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
            {label}
        </span>
        <span
            className={`text-sm font-semibold text-[#00334d] ${
                multiline ? "whitespace-pre-wrap" : "text-right"
            }`}
        >
            {value}
        </span>
    </div>
);
