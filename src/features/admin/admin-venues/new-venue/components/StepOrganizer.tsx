import { Building2, Sparkles } from "lucide-react";

import type { VenueDetailDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { NewVenueFormState } from "@/features/admin/admin-venues/new-venue/types/newVenue.types";
import type { OrganizerMinDTO } from "@/features/admin/admin-organizers/types/organizer.types";

const selectClass =
    "w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-2.5 text-sm text-[#00334d] shadow-[0_4px_20px_-8px_rgba(28,111,181,0.25)] backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#2a8fd4]/60 focus:bg-white/85";

type Props = {
    form: NewVenueFormState;
    organizers: OrganizerMinDTO[];
    organizersLoading: boolean;
    createdVenue: VenueDetailDTO | null;
    onChange: <K extends keyof NewVenueFormState>(
        field: K
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export function StepOrganizer({
    form,
    organizers,
    organizersLoading,
    createdVenue,
    onChange,
}: Props) {
    return (
        <div className="flex flex-col gap-6">
            {createdVenue && (
                <div
                    className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 backdrop-blur-xl shadow-[0_8px_32px_-16px_rgba(16,120,80,0.35)]"
                    style={{
                        boxShadow:
                            "0 8px 32px -12px rgba(16,120,80,0.25), inset 0 1px 0 0 rgba(255,255,255,0.9)",
                    }}
                >
                    <Sparkles className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <div>
                        <p className="text-sm font-bold text-emerald-900">
                            Espaço já criado no sistema
                        </p>
                        <p className="mt-1 text-xs font-medium text-emerald-800/90">
                            {createdVenue.name} · ID {createdVenue.venueId}
                        </p>
                        <p className="mt-2 text-[11px] text-emerald-800/75">
                            Você pode voltar às etapas anteriores para revisar dados. O cadastro não
                            será duplicado ao avançar novamente.
                        </p>
                    </div>
                </div>
            )}

            <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                    Organizador responsável<span className="ml-1 text-[#2a8fd4]">*</span>
                </span>
                <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2a8fd4]/80" />
                    <select
                        className={`${selectClass} h-11 appearance-none pl-10 pr-4`}
                        value={form.organizerID}
                        onChange={onChange("organizerID")}
                        disabled={organizersLoading || !!createdVenue}
                    >
                        <option value="">
                            {organizersLoading ? "Carregando..." : "Selecione um organizador"}
                        </option>
                        {organizers.map((org) => (
                            <option key={org.userID} value={org.userID}>
                                {org.organizerName} — {org.email}
                            </option>
                        ))}
                    </select>
                </div>
                {createdVenue && (
                    <p className="text-[11px] text-[#5e6c87]">
                        Organizador fixado após a criação. Para alterar, edite o espaço depois (se a
                        API permitir) ou contate suporte.
                    </p>
                )}
            </label>
        </div>
    );
}
