import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import useStripeInstance from "../hooks/useStripeInstance";

interface StripePaymentAreaProps {
  clientSecret: string;
  publishableKey: string;
}

function PaymentElementWrapper() {
  return (
    <div className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <p className="text-xs text-muted-foreground">
        Em ambiente de desenvolvimento, confirme o pagamento via Stripe CLI. O status acima
        atualiza automaticamente quando o webhook for recebido.
      </p>
    </div>
  );
}

export default function StripePaymentArea({ clientSecret, publishableKey }: StripePaymentAreaProps) {
  const stripePromise = useStripeInstance(publishableKey);

  if (!stripePromise) return null;

  return (
    <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-5 shadow-sm space-y-4">
      <h2 className="text-base font-semibold text-foreground">Pagamento</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentElementWrapper />
      </Elements>
    </div>
  );
}
