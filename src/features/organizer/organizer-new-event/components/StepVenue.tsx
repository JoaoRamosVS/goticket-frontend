import { Building2, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { VenueMinDTO } from "@/features/admin/admin-venues/types/venue.types";
import type { NewEventFormState } from "@/features/organizer/organizer-new-event/types/newEvent.types";

type StepVenueProps = {
    form: NewEventFormState;
    venues: VenueMinDTO[];
    venuesLoading: boolean;
    onChange: <K extends keyof NewEventFormState>(
        field: K,
        value: NewEventFormState[K]
    ) => void;
};

export const StepVenue = ({
    form,
    venues,
    venuesLoading,
    onChange,
}: StepVenueProps) => {
    const [search, setSearch] = useState("");

    const filteredVenues = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return venues;
        return venues.filter((venue) => {
            const haystack = [
                venue.name,
                venue.legalName,
                venue.city,
                venue.state,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(term);
        });
    }, [venues, search]);

    const selectedVenue = useMemo(
        () =>
            form.venueId
                ? venues.find((v) => String(v.venueID) === form.venueId)
                : null,
        [form.venueId, venues]
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="relative">
                <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/50"
                    strokeWidth={2.6}
                />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome, cidade ou estado"
                    className="h-11 w-full rounded-2xl border border-primary/20 bg-white/70 pl-11 pr-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/70 backdrop-blur-xl shadow-sm outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]"
                />
            </div>

            {venuesLoading ? (
                <div className="rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-6 text-center text-sm text-[#5e6c87]">
                    Carregando espaços disponíveis...
                </div>
            ) : filteredVenues.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-6 text-center text-sm text-[#5e6c87]">
                    Nenhum espaço encontrado. Refine sua busca ou cadastre um novo
                    espaço antes de continuar.
                </div>
            ) : (
                <div
                    className="grid grid-cols-1 gap-2 overflow-y-auto rounded-2xl border border-white/70 bg-white/30 p-2 backdrop-blur-xl sm:grid-cols-2"
                    style={{ maxHeight: 420 }}
                >
                    {filteredVenues.map((venue) => {
                        const isSelected =
                            form.venueId === String(venue.venueID);
                        return (
                            <button
                                key={venue.venueID}
                                type="button"
                                onClick={() =>
                                    onChange("venueId", String(venue.venueID))
                                }
                                className={`group relative flex items-start gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
                                    isSelected
                                        ? "border-transparent text-white"
                                        : "border-white/70 bg-white/55 hover:bg-white"
                                }`}
                                style={
                                    isSelected
                                        ? {
                                              background:
                                                  "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                              boxShadow:
                                                  "0 8px 22px -8px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                          }
                                        : {
                                              boxShadow:
                                                  "0 4px 14px -6px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                                          }
                                }
                            >
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                        isSelected
                                            ? "bg-white/20 text-white"
                                            : "bg-[#e5f1ff] text-[#2a8fd4]"
                                    }`}
                                >
                                    <Building2 className="size-4" strokeWidth={2.6} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`truncate text-sm font-bold ${
                                            isSelected
                                                ? "text-white"
                                                : "text-[#00334d]"
                                        }`}
                                    >
                                        {venue.name}
                                    </p>
                                    <p
                                        className={`mt-0.5 inline-flex items-center gap-1 truncate text-[11px] ${
                                            isSelected
                                                ? "text-white/85"
                                                : "text-[#5e6c87]"
                                        }`}
                                    >
                                        <MapPin className="size-3" strokeWidth={2.4} />
                                        {[venue.city, venue.state]
                                            .filter(Boolean)
                                            .join(", ") || "Sem localização"}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {selectedVenue && (
                <div
                    className="rounded-2xl border border-[#2a8fd4]/30 bg-white/60 px-4 py-3 backdrop-blur-xl"
                    style={{
                        boxShadow:
                            "0 6px 18px -8px rgba(42,143,212,0.25), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                    }}
                >
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2a8fd4]">
                        Espaço selecionado
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#00334d]">
                        {selectedVenue.name}
                    </p>
                    <p className="text-[12px] text-[#5e6c87]">
                        {selectedVenue.legalName}
                        {selectedVenue.city ? ` · ${selectedVenue.city}` : ""}
                        {selectedVenue.state ? `/${selectedVenue.state}` : ""}
                    </p>
                </div>
            )}
        </div>
    );
};
