import { useState } from "react";
import { Ticket, QrCode, ChevronDown } from "lucide-react";
import { formatCurrency } from "../utils/format-currency";
import type { OrderItemResponse } from "../types/order-response.types";
import { ELIGIBILITY_LABELS } from "@/features/checkout/utils/eligibility.constants";

interface OrderItemsListProps {
  items: OrderItemResponse[];
}

interface OrderItemCardProps {
  item: OrderItemResponse;
}

function OrderItemCard({ item }: OrderItemCardProps) {
  const [open, setOpen] = useState(false);
  const qrUrl = item.qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(item.qrToken)}&format=png`
    : null;

  return (
    <div className={`rounded-4xl border bg-background/60 backdrop-blur-md shadow-sm p-6 py-8 flex flex-col ${open ? "gap-4" : ""}`}>
      {/* Linha principal: info + preço */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-linear-to-r from-primary to-[#2959b9] p-3 shadow-2xl shrink-0">
            <Ticket className="size-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{item.holderName}</p>
            <p className="text-xs text-muted-foreground">
              {item.ticketTypeName}
              {item.eligibilityTypeName
                ? ` · ${ELIGIBILITY_LABELS[item.eligibilityTypeName] ?? item.eligibilityTypeName}`
                : ""}
            </p>
            {qrUrl && (
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-white font-semibold transition-all mt-2 bg-linear-to-b from-primary to-[#2959b9] p-2 rounded-4xl  hover:scale-95 duration-200"
              >
                <QrCode className="size-3.5 shrink-0" />
                Consultar QR Code do seu ingresso
                <ChevronDown
                  className={`size-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  strokeWidth={3}
                />
              </button>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-extrabold text-xl tabular-nums text-foreground">
            {formatCurrency(item.unitPrice + item.feeAmount)}
          </p>
          {item.feeAmount > 0 && (
            <p className="text-xs text-muted-foreground tabular-nums">
              incl. {formatCurrency(item.feeAmount)} taxa
            </p>
          )}
        </div>
      </div>

      {/* Painel do QR — ocupa largura total do card */}
      {qrUrl && (
        <>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open ? "max-h-86 pb-6 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex justify-center">
              <div className="rounded-4xl border border-border bg-white/30 p-4 shadow-xl">
                <img
                  src={qrUrl}
                  alt={`QR Code do ingresso de ${item.holderName}`}
                  width={240}
                  height={240}
                  className="block rounded-2xl"
                />
              </div>
            </div>
          </div>
          {/* Preload oculto para garantir fetch antes do usuário abrir */}
          {!open && (
            <img src={qrUrl} alt="" width={1} height={1} className="sr-only" aria-hidden />
          )}
        </>
      )}
    </div>
  );
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-3 pt-6">
      <h2 className="text-4xl font-extrabold text-foreground mb-8">Ingressos:</h2>
      {items.map((item) => (
        <OrderItemCard key={item.orderItemId} item={item} />
      ))}
    </div>
  );
}
