import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SelectedTicketLine } from "@/features/ticket-purchase/types/ticket-purchase.types";
import type { CheckoutFormData } from "../types/checkout-form.types";
import { checkoutFormSchema } from "../utils/checkout-form.schema";
import { expandSelection } from "../utils/expand-selection";

interface UseCheckoutFormParams {
  eventDateId: number;
  lines: SelectedTicketLine[];
}

export default function useCheckoutForm({ eventDateId, lines }: UseCheckoutFormParams) {
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      eventDateId,
      holders: expandSelection(lines),
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: "holders" });

  return { form, fields };
}
