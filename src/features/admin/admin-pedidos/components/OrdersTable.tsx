import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Loader2,
    RefreshCcw,
    Search,
} from "lucide-react";
import type {
    AdminOrderListItemDTO,
    OrderStatusName,
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

const StatusBadge = ({ status }: { status: OrderStatusName | string }) => {
    const name = status as OrderStatusName;
    if (!STATUS_LABELS[name])
        return <span className="text-[#5e6c87]/60 text-xs">{status}</span>;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[name]}`}
        >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {STATUS_LABELS[name]}
        </span>
    );
};

const formatCurrency = (value: number, currency = "BRL") =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);

const formatDate = (iso: string | null) => {
    if (!iso) return null;
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(iso));
};

type OrdersTableProps = {
    orders: AdminOrderListItemDTO[];
    filteredOrders: AdminOrderListItemDTO[];
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
    onView: (orderId: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export const OrdersTable = ({
    orders,
    filteredOrders,
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
    onView,
    onPreviousPage,
    onNextPage,
}: OrdersTableProps) => {
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
                        placeholder="Buscar por ID ou nome do evento"
                        className="h-10 w-full rounded-2xl border border-primary/20 bg-white/70 pl-10 pr-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/70 backdrop-blur-xl shadow-sm outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5e6c87]">
                        {totalElements} pedido{totalElements === 1 ? "" : "s"} no total
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
                            <Th className="pl-6">ID</Th>
                            <Th>Evento</Th>
                            <Th>Status</Th>
                            <Th>Realizado em</Th>
                            <Th>Itens</Th>
                            <Th>Total</Th>
                            <Th>Ações</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-14 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-[#5e6c87]">
                                        <Loader2 className="size-4 animate-spin" />
                                        Carregando pedidos...
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7} className="py-14 text-center text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-14 text-center text-sm text-[#5e6c87]">
                                    {normalizedSearch
                                        ? "Nenhum pedido corresponde à busca nesta página."
                                        : "Nenhum pedido encontrado."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <OrderRow
                                    key={order.orderId}
                                    order={order}
                                    onView={onView}
                                    formatCurrency={formatCurrency}
                                    formatDate={formatDate}
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

type OrderRowProps = {
    order: AdminOrderListItemDTO;
    onView: (orderId: number) => void;
    formatCurrency: (value: number, currency?: string) => string;
    formatDate: (iso: string | null) => string | null;
};

const OrderRow = ({ order, onView, formatCurrency, formatDate }: OrderRowProps) => (
    <tr className="border-b border-white/70 hover:bg-primary/5 hover:scale-[1.01] overflow-hidden transition-all duration-200">
        <td className="py-3 pl-6 pr-2 align-middle text-xs font-semibold text-[#5e6c87]">
            #{order.orderId}
        </td>
        <td className="py-3 pr-4 align-middle">
            <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#00334d] max-w-48">
                    {order.eventTitle}
                </p>
                {(order.venueName || order.venueCity) && (
                    <p className="truncate text-[11px] text-[#5e6c87]">
                        {[order.venueName, order.venueCity].filter(Boolean).join(" · ")}
                    </p>
                )}
            </div>
        </td>
        <td className="py-3 pr-4 align-middle">
            <StatusBadge status={order.status} />
        </td>
        <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
            {formatDate(order.placedAt) ?? <span className="text-[#5e6c87]/60">—</span>}
        </td>
        <td className="py-3 pr-4 align-middle text-sm text-[#5e6c87]">
            <span className="inline-flex items-center justify-center size-6 rounded-full bg-[#e5f1ff] text-[#2a8fd4] text-xs font-bold">
                {order.itemCount}
            </span>
        </td>
        <td className="py-3 pr-4 align-middle text-sm font-semibold text-[#00334d]">
            {formatCurrency(order.totalPrice, order.currency)}
        </td>
        <td className="py-3 pl-2 pr-6 align-middle">
            <button
                type="button"
                onClick={() => onView(order.orderId)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                style={{
                    background:
                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    boxShadow:
                        "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                }}
                title="Ver detalhes"
            >
                <Eye className="size-3.5" strokeWidth={2.4} />
                Detalhar
            </button>
        </td>
    </tr>
);

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className = "", ...props }: ThProps) => (
    <th
        {...props}
        className={`py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87] ${className}`}
    />
);

type PagerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PagerButton = ({ className = "", children, ...props }: PagerButtonProps) => (
    <button
        type="button"
        {...props}
        className={`flex size-9 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-white/60 text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
        {children}
    </button>
);
