/** Mantém apenas dígitos para envio à API de validação de CNPJ. */
export function normalizeCnpjDigits(value: string): string {
    return value.replace(/\D/g, "");
}
