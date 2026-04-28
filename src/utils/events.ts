import type { EventMinDTO } from "@/types";

const FALLBACK_IMAGE_URL =
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80";

const S3_BASE_URL =
    import.meta.env.VITE_S3_PUBLIC_URL ?? "http://localhost:4566/goticket-dev";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

/**
 * Constrói a URL pública (ou compatível com o LocalStack em dev) para um
 * `imageKey` retornado pelo backend. Quando não há chave válida, retorna
 * uma imagem de fallback para evitar placeholders quebrados na UI.
 */
export function buildEventImageUrl(imageKey?: string | null): string {
    if (!imageKey) return FALLBACK_IMAGE_URL;
    return `${S3_BASE_URL.replace(/\/$/, "")}/${imageKey}`;
}

/**
 * Retorna a URL da imagem principal do evento (primeira da lista)
 * ou um fallback quando o evento não possui imagens cadastradas.
 */
export function getEventMainImage(event: EventMinDTO): string {
    const firstKey = event.imageKeys?.[0];
    return buildEventImageUrl(firstKey);
}

/**
 * Formata a data de início do evento para um padrão legível em pt-BR
 * (ex.: "12 de junho de 2024"). Aceita `LocalDateTime` (sem timezone) ou
 * qualquer string ISO válida. Retorna string vazia em caso de input inválido.
 */
export function formatEventDate(isoDate: string | null | undefined): string {
    if (!isoDate) return "";
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return "";
    return DATE_FORMATTER.format(parsed);
}

/**
 * Monta a string de localização a partir dos campos do venue.
 * Ex.: "Espaço das Américas, São Paulo, SP".
 */
export function formatEventLocation(event: EventMinDTO): string {
    return [event.venueName, event.venueCity, event.venueState]
        .filter((part): part is string => Boolean(part && part.trim()))
        .join(", ");
}

/**
 * Normaliza o `startingPrice` vindo da API (pode ser `number`, `string`
 * ou `null`) para um número seguro para uso em cálculos/formatadores.
 * Retorna `null` quando não é possível inferir um preço.
 */
export function getEventStartingPrice(event: EventMinDTO): number | null {
    if (event.startingPrice === null || event.startingPrice === undefined) {
        return null;
    }
    const value =
        typeof event.startingPrice === "number"
            ? event.startingPrice
            : Number(event.startingPrice);
    return Number.isFinite(value) ? value : null;
}

/**
 * Formata o preço mínimo do evento no padrão monetário brasileiro (R$).
 * Retorna null quando não existe preço disponível.
 */
export function formatEventStartingPrice(event: EventMinDTO): string | null {
    const value = getEventStartingPrice(event);
    if (value === null) return null;
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
