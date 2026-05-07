import { Ticket } from "lucide-react";
import TicketTypeRow from "@/features/ticket-purchase/components/TicketTypeRow";
import PurchaseSummary from "@/features/ticket-purchase/components/PurchaseSummary";
import { availableTicketTypeOptions } from "@/features/ticket-purchase/utils/ticket-purchase.helpers";
import type { TicketTypePickerProps } from "@/features/ticket-purchase/types/ticket-purchase.types";

const TicketTypePicker = ({
    sector,
    quantities,
    onChangeQuantity,
    totals,
    onConfirm,
}: TicketTypePickerProps) => {
    const options = sector ? availableTicketTypeOptions(sector) : [];

    return (
        <aside className="sticky top-28 rounded-4xl border bg-card/60 backdrop-blur-xl p-6 shadow-sm">
            <header className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-t from-primary to-[#2959b9] text-white">
                    <Ticket className="size-5" />
                </span>
                <div>
                    <h2 className="text-xl font-extrabold">
                        {sector ? sector.name : "Seu pedido"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {sector
                            ? "Escolha o tipo e a quantidade de ingressos."
                            : "Selecione um setor para ver os ingressos disponíveis."}
                    </p>
                </div>
            </header>

            {!sector && (
                <div className="rounded-2xl border border-dashed bg-background/40 p-6 text-center text-sm text-muted-foreground">
                    Os tipos de ingresso (inteira, meia e solidária) aparecem
                    aqui assim que você escolher um setor.
                </div>
            )}

            {sector && options.length === 0 && (
                <div className="rounded-2xl border bg-background/40 p-6 text-center">
                    <p className="text-sm font-semibold text-destructive">
                        Sem ingressos disponíveis neste setor.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Tente escolher outro setor desta data.
                    </p>
                </div>
            )}

            {sector && options.length > 0 && (
                <div className="flex flex-col gap-4">
                    {options.map((option) => (
                        <TicketTypeRow
                            key={option.type}
                            option={option}
                            quantity={quantities[option.type] ?? 0}
                            onChange={(next) =>
                                onChangeQuantity(option.type, next)
                            }
                        />
                    ))}

                    <div className="mt-2">
                        <PurchaseSummary
                            totals={totals}
                            sectorName={sector.name}
                            onConfirm={onConfirm}
                        />
                    </div>
                </div>
            )}
        </aside>
    );
};

export default TicketTypePicker;
