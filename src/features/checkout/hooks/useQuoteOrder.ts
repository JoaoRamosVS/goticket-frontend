import { useEffect, useState } from "react";
import type { SelectedTicketLine } from "@/features/ticket-purchase/types/ticket-purchase.types";
import checkoutService from "../services/checkout.service";
import type { QuoteResponse } from "../types/order-api.types";
import { TICKET_TYPE_ID } from "../utils/ticket-type.constants";

interface UseQuoteOrderParams {
  eventDateId: number;
  lines: SelectedTicketLine[];
}

interface UseQuoteOrderResult {
  quote: QuoteResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function useQuoteOrder({ eventDateId, lines }: UseQuoteOrderParams): UseQuoteOrderResult {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const items = lines.flatMap((line) =>
      Array.from({ length: line.quantity }, () => ({
        batchAllotmentId: line.allotmentId,
        ticketTypeId: TICKET_TYPE_ID[line.type],
      }))
    );

    setLoading(true);
    setError(null);

    checkoutService
      .quoteOrder({ eventDateId, items }, controller.signal)
      .then(setQuote)
      .catch((err) => {
        if (err?.name !== "CanceledError" && err?.code !== "ERR_CANCELED") {
          setError("Não foi possível calcular o valor. Tente voltar e refazer a seleção.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [eventDateId, lines]);

  return { quote, isLoading, error };
}
