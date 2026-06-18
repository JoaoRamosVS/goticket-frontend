import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CheckoutNavigationState } from "../types/checkout-state.types";
import { loadPurchaseContext } from "../utils/purchase-context";

function isValidSelection(
  value: CheckoutNavigationState | null
): value is CheckoutNavigationState {
  return (
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value.lines) &&
    value.lines.length > 0 &&
    typeof value.eventDateId === "number"
  );
}

export default function useCheckoutSelection(): CheckoutNavigationState | null {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve uma vez: location.state (fluxo normal vindo da fila) ?? sessionStorage (reload).
  const [selection] = useState<CheckoutNavigationState | null>(() => {
    const fromState = location.state as CheckoutNavigationState | null;
    if (isValidSelection(fromState)) return fromState;
    return loadPurchaseContext();
  });

  useEffect(() => {
    if (!isValidSelection(selection)) {
      navigate("/", { replace: true });
    }
  }, [selection, navigate]);

  return isValidSelection(selection) ? selection : null;
}
