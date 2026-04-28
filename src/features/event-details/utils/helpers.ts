export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isSameCalendarDay(startIso: string, endIso: string) {
    const start = new Date(startIso);
    const end = new Date(endIso);

    return (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()
    );
}

export function formatNumber(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".0", "")}k`;
    return n.toString();
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
