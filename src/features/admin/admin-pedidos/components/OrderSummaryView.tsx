import { Loader2, MapPin, Calendar, Receipt, Ticket } from "lucide-react";
import type {
    AdminOrderSummaryDTO,
    OrderStatusName,
    OrderSummaryItemDTO,
} from "@/features/admin/admin-pedidos/types/order.types";

const STATUS_LABELS: Record<OrderStatusName, string> = {
    PENDING_PAYMENT: "Aguardando Pagamento",
    PAID: "Pago",
    CANCELED: "Cancelado",
    EXPIRED: "Expirado",
    REFUNDED: "Reembolsado",
};

const STATUS_STYLES: Record<OrderStatusName, string> = {
    PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200/70",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    CANCELED: "bg-red-50 text-red-600 border-red-200/70",
    EXPIRED: "bg-slate-50 text-slate-600 border-slate-200/70",
    REFUNDED: "bg-purple-50 text-purple-700 border-purple-200/70",
};

const formatCurrency = (value: number, currency = "BRL") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);

const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(iso));
};

type OrderSummaryViewProps = {
    summary: AdminOrderSummaryDTO | null;
    isLoading: boolean;
    error: string | null;
};

export const OrderSummaryView = ({
    summary,
    isLoading,
    error,
}: OrderSummaryViewProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="inline-flex items-center gap-2 text-sm text-[#5e6c87]">
                    <Loader2 className="size-5 animate-spin text-[#2a8fd4]" />
                    Carregando pedido...
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="flex items-center justify-center py-24">
                <p className="text-sm text-red-500">{error ?? "Pedido não encontrado."}</p>
            </div>
        );
    }

    const statusName = summary.status as OrderStatusName;

    return (
        <div className="flex flex-col gap-6">
            {/* Cabeçalho do pedido */}
            <div
                className="rounded-3xl border border-white/70 bg-white/30 backdrop-blur-xl p-6"
                style={{
                    boxShadow:
                        "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                }}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]/70">
                            Pedido
                        </p>
                        <h2 className="text-2xl font-bold text-[#00334d]">
                            #{summary.orderId}
                        </h2>
                        <span
                            className={`mt-1 inline-flex w-fit items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[statusName] ?? "bg-slate-50 text-slate-600 border-slate-200/70"}`}
                        >
                            <span className="size-1.5 rounded-full bg-current opacity-70" />
                            {STATUS_LABELS[statusName] ?? summary.status}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-[#5e6c87] sm:text-right">
                        {summary.paidAt && (
                            <span className="inline-flex items-center gap-1.5 sm:justify-end">
                                <Receipt className="size-3.5 text-[#2a8fd4]" />
                                Pago em {formatDate(summary.paidAt)}
                            </span>
                        )}
                        {summary.venueName && (
                            <span className="inline-flex items-center gap-1.5 sm:justify-end">
                                <MapPin className="size-3.5 text-[#2a8fd4]" />
                                {[summary.venueName, summary.venueCity]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </span>
                        )}
                        {summary.eventStartDate && (
                            <span className="inline-flex items-center gap-1.5 sm:justify-end">
                                <Calendar className="size-3.5 text-[#2a8fd4]" />
                                {formatDate(summary.eventStartDate)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4 h-px bg-linear-to-r from-transparent via-[#2a8fd4]/20 to-transparent" />

                <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]/70">
                        Evento
                    </p>
                    <p className="mt-1 text-base font-bold text-[#00334d]">
                        {summary.eventTitle}
                    </p>
                </div>
            </div>

            {/* Itens do pedido */}
            <div
                className="rounded-3xl border border-white/70 bg-white/25 backdrop-blur-xl overflow-hidden"
                style={{
                    boxShadow:
                        "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
                }}
            >
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/70">
                    <span
                        className="flex size-8 items-center justify-center rounded-xl text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.4), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        <Ticket className="size-4" strokeWidth={2.4} />
                    </span>
                    <h3 className="text-sm font-bold text-[#00334d]">
                        Ingressos ({summary.items.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/70 bg-[#e5f1ff]/40 text-left">
                                <Th className="pl-6">Setor / Tipo</Th>
                                <Th>Portador</Th>
                                <Th>Unitário</Th>
                                <Th>Taxa</Th>
                                <Th className="pr-6">Subtotal</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.items.map((item) => (
                                <ItemRow
                                    key={item.orderItemId}
                                    item={item}
                                    currency={summary.currency}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totais */}
                <div className="border-t border-white/70 px-6 py-4">
                    <div className="ml-auto flex max-w-xs flex-col gap-2">
                        <PriceLine
                            label="Subtotal"
                            value={formatCurrency(summary.subtotal, summary.currency)}
                        />
                        <PriceLine
                            label="Taxas"
                            value={formatCurrency(summary.feesTotal, summary.currency)}
                        />
                        <div className="my-1 h-px bg-linear-to-r from-transparent via-[#2a8fd4]/20 to-transparent" />
                        <PriceLine
                            label="Total"
                            value={formatCurrency(summary.totalPrice, summary.currency)}
                            bold
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemRow = ({
    item,
    currency,
}: {
    item: OrderSummaryItemDTO;
    currency: string;
}) => (
    <tr className="border-b border-white/70 hover:bg-primary/5 transition-colors duration-150">
        <td className="py-3 pl-6 pr-4 align-middle">
            <p className="font-semibold text-[#00334d]">{item.sectorName}</p>
            <p className="text-[11px] text-[#5e6c87]">{item.ticketTypeName}</p>
        </td>
        <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
            {item.holderName || <span className="text-[#5e6c87]/40">—</span>}
        </td>
        <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
            {formatCurrency(item.unitPrice, currency)}
        </td>
        <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
            {formatCurrency(item.feeAmount, currency)}
        </td>
        <td className="py-3 pr-6 align-middle text-sm font-semibold text-[#00334d]">
            {formatCurrency(item.itemTotal, currency)}
        </td>
    </tr>
);

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className = "", ...props }: ThProps) => (
    <th
        {...props}
        className={`py-3 pr-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87] ${className}`}
    />
);

const PriceLine = ({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) => (
    <div className="flex items-center justify-between gap-4">
        <span
            className={`text-sm ${bold ? "font-bold text-[#00334d]" : "text-[#5e6c87]"}`}
        >
            {label}
        </span>
        <span
            className={`text-sm ${bold ? "font-bold text-[#00334d]" : "text-[#5e6c87]"}`}
        >
            {value}
        </span>
    </div>
);
