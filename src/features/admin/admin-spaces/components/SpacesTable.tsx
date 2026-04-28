import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    Pencil,
    RefreshCcw,
    Search,
    ShieldCheck,
    ShieldOff,
    UserCircle2,
} from "lucide-react";

import type { VenueMinDTO } from "@/features/admin/admin-spaces/types/space.types";

function formatLocation(venue: VenueMinDTO): string | null {
    if (venue.city && venue.state) {
        return `${venue.city}/${venue.state}`;
    }
    return venue.city ?? venue.state ?? null;
}

type SpacesTableProps = {
    venues: VenueMinDTO[];
    filteredVenues: VenueMinDTO[];
    page: number;
    totalPages: number;
    totalElements: number;
    isLoading: boolean;
    error: string | null;
    searchInput: string;
    normalizedSearch: string;
    rangeStart: number;
    rangeEnd: number;
    onSearchInputChange: (value: string) => void;
    onReload: () => void;
    onEdit: (venueId: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export const SpacesTable = ({
    venues,
    filteredVenues,
    page,
    totalPages,
    totalElements,
    isLoading,
    error,
    searchInput,
    normalizedSearch,
    rangeStart,
    rangeEnd,
    onSearchInputChange,
    onReload,
    onEdit,
    onPreviousPage,
    onNextPage,
}: SpacesTableProps) => {
    return (
        <div
            className="rounded-4xl border border-white/70 bg-white/25 backdrop-blur-xl"
            style={{
                boxShadow:
                    "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
            }}
        >
            <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary/50 z-10"
                        strokeWidth={3}
                    />
                    <input
                        type="search"
                        value={searchInput}
                        onChange={(e) => onSearchInputChange(e.target.value)}
                        placeholder="Buscar por nome, CNPJ, organizador ou cidade"
                        className="h-10 w-full rounded-2xl border border-primary/20 bg-white/70 pl-10 pr-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/70 backdrop-blur-xl shadow-sm outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5e6c87]">
                        {totalElements} espaço{totalElements === 1 ? "" : "s"} no total
                    </span>
                    <button
                        type="button"
                        onClick={onReload}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-[#2a8fd4] text-white transition-all duration-300 hover:scale-90 shadow-xl"
                        aria-label="Recarregar"
                        title="Recarregar"
                    >
                        <RefreshCcw
                            className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                            strokeWidth={2.3}
                        />
                    </button>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm overflow-hidden">
                    <thead>
                        <tr className="border-y border-white/80 bg-linear-to-r from-[#e5f1ff]/60 to-transparent text-left">
                            <Th className="pl-6">Espaço</Th>
                            <Th>CNPJ</Th>
                            <Th>Organizador</Th>
                            <Th>Localização</Th>
                            <Th>Status</Th>
                            <Th>Ações</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && venues.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-14 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-[#5e6c87]">
                                        <Loader2 className="size-4 animate-spin" />
                                        Carregando espaços...
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="py-14 text-center text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredVenues.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-14 text-center text-sm text-[#5e6c87]">
                                    {normalizedSearch
                                        ? "Nenhum espaço corresponde à busca nesta página."
                                        : "Nenhum espaço encontrado."}
                                </td>
                            </tr>
                        ) : (
                            filteredVenues.map((venue) => (
                                <VenueRow
                                    key={venue.venueID}
                                    venue={venue}
                                    onEdit={onEdit}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-white/70 px-5 py-4 sm:flex-row">
                <span className="text-xs text-[#5e6c87]">
                    Mostrando{" "}
                    <span className="font-semibold text-[#00334d]">
                        {rangeStart}–{rangeEnd}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-[#00334d]">
                        {totalElements}
                    </span>
                </span>

                <div className="flex items-center gap-2">
                    <PagerButton
                        disabled={page === 0 || isLoading}
                        onClick={onPreviousPage}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </PagerButton>

                    <span className="rounded-xl border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#00334d]">
                        {page + 1} / {totalPages}
                    </span>

                    <PagerButton
                        disabled={page + 1 >= totalPages || isLoading}
                        onClick={onNextPage}
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="size-4" />
                    </PagerButton>
                </div>
            </div>
        </div>
    );
};

type VenueRowProps = {
    venue: VenueMinDTO;
    onEdit: (venueId: number) => void;
};

const VenueRow = ({ venue, onEdit }: VenueRowProps) => {
    const location = formatLocation(venue);
    const isActive = venue.statusName === "ACTIVE";

    return (
        <tr className="border-b border-white/70 hover:bg-primary/5 hover:scale-[1.02] overflow-hidden transition-all duration-200">
            <td className="py-3 pl-6 pr-4 align-middle">
                <div className="flex items-center gap-3">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        <Building2 className="size-5" strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#00334d]">
                            {venue.name}
                        </p>
                        <p className="truncate text-[11px] text-[#5e6c87]">
                            {venue.legalName}
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87] font-mono">
                {venue.CNPJ || <span className="text-[#5e6c87]/60">—</span>}
            </td>
            <td className="py-3 pr-4 align-middle text-sm text-[#00334d]">
                {venue.organizerName ? (
                    <span className="inline-flex items-center gap-1.5">
                        <UserCircle2 className="size-3.5 text-[#2a8fd4]" />
                        {venue.organizerName}
                    </span>
                ) : (
                    <span className="text-[#5e6c87]/60">—</span>
                )}
            </td>
            <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
                {location ? (
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#2a8fd4]" />
                        {location}
                    </span>
                ) : (
                    <span className="text-[#5e6c87]/60">—</span>
                )}
            </td>
            <td className="py-3 pr-4 align-middle">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ${
                        isActive
                            ? "bg-emerald-100/70 text-emerald-700"
                            : "bg-red-100/70 text-red-600"
                    }`}
                >
                    {isActive ? (
                        <ShieldCheck className="size-3" strokeWidth={2.6} />
                    ) : (
                        <ShieldOff className="size-3" strokeWidth={2.6} />
                    )}
                    {isActive ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td className="py-3 pl-2 pr-6 align-middle">
                <div className="flex items-center justify-start gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(venue.venueID)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                        title="Editar espaço"
                    >
                        <Pencil className="size-3.5" strokeWidth={2.6} />
                        Editar
                    </button>
                </div>
            </td>
        </tr>
    );
};

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className = "", ...props }: ThProps) => (
    <th
        {...props}
        className={`py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87] ${className}`}
    />
);

type PagerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PagerButton = ({
    className = "",
    children,
    ...props
}: PagerButtonProps) => (
    <button
        type="button"
        {...props}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
        {children}
    </button>
);
