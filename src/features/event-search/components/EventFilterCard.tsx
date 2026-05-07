import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortOption, EventSearchFilters } from "../types/eventSearch.types";
import { SORT_LABELS } from "../types/eventSearch.types";

type EventFilterCardProps = {
    filters: EventSearchFilters;
    sort: SortOption;
    onFilterChange: (key: string, value: string) => void;
    onSortChange: (sort: SortOption) => void;
    onClearFilters: () => void;
    className?: string;
};

const EventFilterCard = ({
    filters,
    sort,
    onFilterChange,
    onSortChange,
    onClearFilters,
    className,
}: EventFilterCardProps) => {
    const hasActiveFilters =
        filters.venueState || filters.venueCity || filters.maxPrice;

    return (
        <aside
            className={cn(
                "rounded-4xl border border-white/50 bg-white/25 p-6 backdrop-blur-2xl",
                className
            )}
            style={{
                boxShadow:
                    "0 8px 32px -8px rgba(0,46,71,0.10), 0 2px 8px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.7)",
            }}
        >
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-6 text-[#2a8fd4]" />
                    <span className="text-xl font-bold">
                        Filtros
                    </span>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-[#5e6c87] transition-colors hover:bg-[#2a8fd4]/10 hover:text-[#2a8fd4]"
                    >
                        <X className="size-3" />
                        Limpar
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <FilterSection label="Ordenar por">
                    <div className="flex flex-col gap-0.5">
                        {(
                            Object.entries(SORT_LABELS) as [SortOption, string][]
                        ).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onSortChange(value)}
                                className={cn(
                                    "flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] px-3 py-2 text-left text-sm transition-all duration-150",
                                    sort === value
                                        ? "bg-[#2a8fd4]/10 font-semibold text-[#2a8fd4]"
                                        : "text-[#5e6c87] hover:bg-white/40"
                                )}
                            >
                                <span
                                    className={cn(
                                        "size-2 shrink-0 rounded-full transition-colors",
                                        sort === value
                                            ? "bg-[#2a8fd4]"
                                            : "bg-[#5e6c87]/25"
                                    )}
                                />
                                {label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection label="Estado">
                    <DebouncedInput
                        placeholder="Ex: SP, RJ, MG…"
                        value={filters.venueState}
                        onCommit={(v) => onFilterChange("venueState", v)}
                    />
                </FilterSection>

                <FilterSection label="Cidade">
                    <DebouncedInput
                        placeholder="Ex: São Paulo…"
                        value={filters.venueCity}
                        onCommit={(v) => onFilterChange("venueCity", v)}
                    />
                </FilterSection>

                <FilterSection label="Preço máximo (R$)">
                    <DebouncedInput
                        type="number"
                        placeholder="Ex: 150"
                        value={filters.maxPrice}
                        onCommit={(v) => onFilterChange("maxPrice", v)}
                    />
                </FilterSection>
            </div>
        </aside>
    );
};

function FilterSection({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5e6c87]/70">
                {label}
            </span>
            {children}
        </div>
    );
}

function DebouncedInput({
    placeholder,
    value,
    onCommit,
    type = "text",
}: {
    placeholder: string;
    value: string;
    onCommit: (v: string) => void;
    type?: string;
}) {
    const [local, setLocal] = useState(value);

    useEffect(() => {
        setLocal(value);
    }, [value]);

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={() => {
                if (local !== value) onCommit(local);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") onCommit(local);
            }}
            className="w-full rounded-[14px] shadow-xs bg-white/40 px-3.5 py-2.5 text-sm text-[#002233] outline-none placeholder:text-[#5e6c87]/40 transition-all duration-200 focus:border-[#2a8fd4]/50 focus:bg-white/60 focus:ring-2 focus:ring-[#2a8fd4]/15"
        />
    );
}

export default EventFilterCard;
