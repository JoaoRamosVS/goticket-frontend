import { Armchair, Check, ChevronRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/features/event-details/utils/helpers";
import { isSectorAvailable } from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type { SectorCardProps } from "@/features/ticket-purchase/types/ticket-purchase.types";

const SectorCard = ({
    sector,
    selected,
    hovered,
    onSelect,
    onHoverChange,
}: SectorCardProps) => {
    const available = isSectorAvailable(sector);
    const Icon = sector.hasNumberedSeats ? Armchair : Users;

    return (
        <button
            type="button"
            onClick={available ? onSelect : undefined}
            disabled={!available}
            aria-pressed={selected}
            onMouseEnter={() => available && onHoverChange(true)}
            onMouseLeave={() => available && onHoverChange(false)}
            onFocus={() => available && onHoverChange(true)}
            onBlur={() => available && onHoverChange(false)}
            className={cn(
                "group relative w-full text-left rounded-2xl border p-5 shadow-xs bg-card/50 backdrop-blur-md transition-all",
                available
                    ? "cursor-pointer hover:border-primary/60 hover:bg-card/70"
                    : "opacity-60 cursor-not-allowed",
                selected && available
                    ? "border-primary ring-2 ring-primary/40 bg-card/80"
                    : "",
                hovered && available && !selected
                    ? "border-primary/60 bg-card/70"
                    : ""
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2 min-w-0">
                    <p className="flex items-center gap-2 text-lg font-bold text-foreground">
                        <Icon className="size-5 text-primary" />
                        {sector.name}
                    </p>
                    {sector.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {sector.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border bg-background/60 px-2.5 py-0.5">
                            {sector.hasNumberedSeats
                                ? "Lugares numerados"
                                : "Lugares livres"}
                        </span>
                        <span className="rounded-full border bg-background/60 px-2.5 py-0.5">
                            {sector.availableTickets} disponíveis
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    {sector.startingPrice !== null ? (
                        <>
                            <p className="text-xs text-muted-foreground">
                                A partir de
                            </p>
                            <p className="text-lg font-bold text-foreground">
                                {formatCurrency(sector.startingPrice)}
                            </p>
                        </>
                    ) : (
                        <p className="text-xs font-semibold text-destructive">
                            Sem ingressos
                        </p>
                    )}
                    {available && (
                        selected ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                                <Check className="size-3.5" />
                                Selecionado
                            </span>
                        ) : (
                            <ChevronRight className="size-5 text-primary transition-transform group-hover:translate-x-0.5" />
                        )
                    )}
                </div>
            </div>
        </button>
    );
};

export default SectorCard;
