import type { CheckoutNavigationState } from "../types/checkout-state.types";

/**
 * Persiste o contexto de compra (seleção de ingressos) em sessionStorage para sobreviver a
 * reload (F5) durante a sala de espera. Um fluxo de compra ativo por aba → chave única.
 * O admissionToken NÃO é persistido: é curto (TTL 20 min) e re-obtenível via re-admissão na fila.
 */
const KEY = "goticket:purchase-context";

function isValidSelection(value: unknown): value is CheckoutNavigationState {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<CheckoutNavigationState>;
  return (
    Array.isArray(candidate.lines) &&
    candidate.lines.length > 0 &&
    typeof candidate.eventDateId === "number"
  );
}

export function savePurchaseContext(state: CheckoutNavigationState): void {
  const { admissionToken: _admissionToken, ...persistable } = state;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(persistable));
  } catch {
    // sessionStorage indisponível (modo privado/quota) — segue sem persistência.
  }
}

export function loadPurchaseContext(): CheckoutNavigationState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidSelection(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPurchaseContext(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // noop
  }
}
