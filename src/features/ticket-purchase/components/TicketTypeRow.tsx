import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/event-details/utils/helpers";
import {
    maxQuantityFor,
    ticketTypeDescription,
} from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type { TicketTypeOption } from "@/features/ticket-purchase/types/ticket-purchase.types";

type TicketTypeRowProps = {
    option: TicketTypeOption;
    quantity: number;
    onChange: (next: number) => void;
};

const TicketTypeRow = ({ option, quantity, onChange }: TicketTypeRowProps) => {
    const max = maxQuantityFor(option.allotment);
    const price = Number(option.allotment.price) || 0;
    const canIncrement = quantity < max;
    const canDecrement = quantity > 0;

    return (
        <div className="rounded-2xl border bg-card backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-foreground">
                            {option.label}
                        </p>
                        <span className="rounded-full border bg-linear-to-r from-primary to-[#2959b9] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                            Lote {option.allotment.batchNumber}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {ticketTypeDescription(option.type)}
                    </p>
                    <p className="text-lg font-extrabold text-foreground">
                        {formatCurrency(price)}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 rounded-full shadow-sm bg-background/60 p-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onChange(quantity - 1)}
                            disabled={!canDecrement}
                            aria-label={`Reduzir quantidade de ${option.label}`}
                            className="rounded-full"
                        >
                            <Minus className="size-4" />
                        </Button>
                        <span
                            className="min-w-6 text-center text-sm font-bold tabular-nums"
                            aria-live="polite"
                        >
                            {quantity}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onChange(quantity + 1)}
                            disabled={!canIncrement}
                            aria-label={`Aumentar quantidade de ${option.label}`}
                            className="rounded-full"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        {max > 0
                            ? `Máx. ${max} por compra`
                            : "Indisponível"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TicketTypeRow;
