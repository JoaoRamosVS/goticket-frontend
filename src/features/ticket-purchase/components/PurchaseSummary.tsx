import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/event-details/utils/helpers";
import type { SelectionTotals } from "@/features/ticket-purchase/types/ticket-purchase.types";

type PurchaseSummaryProps = {
    totals: SelectionTotals;
    sectorName: string | null;
    onConfirm: () => void;
};

const PurchaseSummary = ({
    totals,
    sectorName,
    onConfirm,
}: PurchaseSummaryProps) => {
    const hasSelection = totals.totalQuantity > 0;

    return (
        <div className="rounded-2xl border bg-background/70 backdrop-blur-md p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Total
                    </p>
                    <p className="text-2xl font-extrabold text-foreground">
                        {formatCurrency(totals.totalAmount)}
                    </p>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">
                    {totals.totalQuantity}{" "}
                    {totals.totalQuantity === 1 ? "ingresso" : "ingressos"}
                </p>
            </div>

            {hasSelection && (
                <ul className="mt-3 flex flex-col gap-1 border-t pt-3">
                    {totals.lines.map((line) => (
                        <li
                            key={`${line.allotmentId}`}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-muted-foreground">
                                {line.quantity}× {line.label}
                                {sectorName ? ` · ${sectorName}` : ""}
                            </span>
                            <span className="font-semibold text-foreground tabular-nums">
                                {formatCurrency(
                                    line.unitPrice * line.quantity
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <Button
                type="button"
                onClick={onConfirm}
                disabled={!hasSelection}
                className="mt-4 w-full h-11 rounded-xl text-base"
            >
                Continuar
            </Button>
        </div>
    );
};

export default PurchaseSummary;
