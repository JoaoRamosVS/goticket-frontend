import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CheckoutNavigationState } from "../types/checkout-state.types";

export default function useCheckoutSelection(): CheckoutNavigationState | null {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutNavigationState | null;

  const isValid =
    state !== null &&
    typeof state === "object" &&
    Array.isArray(state.lines) &&
    state.lines.length > 0 &&
    typeof state.eventDateId === "number";

  useEffect(() => {
    if (!isValid) {
      navigate("/", { replace: true });
    }
  }, [isValid, navigate]);

  return isValid ? state : null;
}
