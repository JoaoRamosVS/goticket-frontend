import type { EventMinDTO } from "@/features/admin/admin-events/types/event.types";
import { getEventStartingPrice } from "@/utils/events";

export type SortOption =
    | "date_asc"
    | "date_desc"
    | "price_asc"
    | "price_desc"
    | "title_az";

export const SORT_LABELS: Record<SortOption, string> = {
    date_asc: "Data (mais próxima)",
    date_desc: "Data (mais distante)",
    price_asc: "Menor preço",
    price_desc: "Maior preço",
    title_az: "Título (A–Z)",
};

export interface EventListFilters {
    venueState: string;
    venueCity: string;
    maxPrice: string;
}

export function sortEvents(events: EventMinDTO[], sort: SortOption): EventMinDTO[] {
    const sorted = [...events];
    switch (sort) {
        case "date_desc":
            return sorted.sort((a, b) => b.startDate.localeCompare(a.startDate));
        case "price_asc":
            return sorted.sort((a, b) => {
                const pa = getEventStartingPrice(a) ?? Infinity;
                const pb = getEventStartingPrice(b) ?? Infinity;
                return pa - pb;
            });
        case "price_desc":
            return sorted.sort((a, b) => {
                const pa = getEventStartingPrice(a) ?? -Infinity;
                const pb = getEventStartingPrice(b) ?? -Infinity;
                return pb - pa;
            });
        case "title_az":
            return sorted.sort((a, b) =>
                a.title.localeCompare(b.title, "pt-BR")
            );
        default:
            return sorted.sort((a, b) =>
                a.startDate.localeCompare(b.startDate)
            );
    }
}
