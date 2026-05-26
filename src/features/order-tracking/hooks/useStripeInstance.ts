import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// Cache por publishableKey para evitar múltiplas instâncias (React StrictMode / re-mounts)
const stripeCache = new Map<string, Promise<Stripe | null>>();

export default function useStripeInstance(publishableKey: string | undefined) {
  return useMemo(() => {
    if (!publishableKey) return null;
    const cached = stripeCache.get(publishableKey);
    if (cached) return cached;
    const promise = loadStripe(publishableKey);
    stripeCache.set(publishableKey, promise);
    return promise;
  }, [publishableKey]);
}
