import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import useCheckoutSelection from "@/features/checkout/hooks/useCheckoutSelection";
import useQuoteOrder from "@/features/checkout/hooks/useQuoteOrder";
import useEligibilityTypes from "@/features/checkout/hooks/useEligibilityTypes";
import useCheckoutForm from "@/features/checkout/hooks/useCheckoutForm";
import usePlaceOrder from "@/features/checkout/hooks/usePlaceOrder";
import CheckoutLayout from "@/features/checkout/components/CheckoutLayout";
import BackToSelectionLink from "@/features/checkout/components/BackToSelectionLink";
import HoldersForm from "@/features/checkout/components/HoldersForm";
import QuoteSummaryCard from "@/features/checkout/components/QuoteSummaryCard";
import CheckoutSubmitButton from "@/features/checkout/components/CheckoutSubmitButton";
import type { CheckoutFormData } from "@/features/checkout/types/checkout-form.types";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const selection = useCheckoutSelection();

  const hasHalfLine = (selection?.lines ?? []).some((l) => l.type === "HALF");
  const { quote, isLoading: quoteLoading, error: quoteError } = useQuoteOrder({
    eventDateId: selection?.eventDateId ?? 0,
    lines: selection?.lines ?? [],
  });
  const { eligibilityTypes } = useEligibilityTypes({ enabled: hasHalfLine });
  const { form, fields } = useCheckoutForm({
    eventDateId: selection?.eventDateId ?? 0,
    lines: selection?.lines ?? [],
  });
  const { submit, isSubmitting } = usePlaceOrder();

  if (!selection) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 mt-32 flex justify-center">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (data: CheckoutFormData) => {
    try {
      const response = await submit(data);
      navigate(`/pedidos/${response.orderId}`, {
        state: response,
        replace: true,
      });
    } catch (err: unknown) {
      const apiErrors = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors;
      const message = Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors[0]
        : "Não foi possível finalizar o pedido. Tente novamente.";
      showToast({ type: "error", message });
    }
  };

  if (quoteError) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 mt-32">
        <div className="rounded-2xl border bg-destructive/10 border-destructive/20 p-6 text-center space-y-3">
          <p className="font-semibold text-destructive">Erro ao calcular o valor</p>
          <p className="text-sm text-muted-foreground">{quoteError}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm underline text-muted-foreground hover:text-foreground"
          >
            Voltar à seleção
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CheckoutLayout
          form={
            <>
              <BackToSelectionLink
                eventId={selection.eventId}
                eventDateId={selection.eventDateId}
              />
              <HoldersForm fields={fields} eligibilityTypes={eligibilityTypes} />
              <CheckoutSubmitButton isSubmitting={isSubmitting} />
            </>
          }
          summary={
            <QuoteSummaryCard
              quote={quote}
              isLoading={quoteLoading}
              sectorName={selection.sectorName}
            />
          }
        />
      </form>
    </Form>
  );
}
