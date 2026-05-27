import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import useStripeInstance from "../hooks/useStripeInstance";

interface StripePaymentAreaProps {
  clientSecret: string;
  publishableKey: string;
}

function PaymentElementWrapper() {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
    });

    if (error) {
      setErrorMessage(error.message ?? "Erro ao processar pagamento.");
      setIsSubmitting(false);
    }
    // sem erro → Stripe redireciona para return_url
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />
      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full py-3 px-6 rounded-2xl font-semibold text-white text-base bg-linear-to-t from-blue-700 to-blue-400 shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processando..." : "Finalizar Pagamento"}
      </button>
    </form>
  );
}

export default function StripePaymentArea({ clientSecret, publishableKey }: StripePaymentAreaProps) {
  const stripePromise = useStripeInstance(publishableKey);

  if (!stripePromise) return null;

  return (
    <div className="rounded-4xl border bg-white/60 backdrop-blur-md p-8 shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-foreground pb-2">Pagamento:</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentElementWrapper />
      </Elements>
    </div>
  );
}
