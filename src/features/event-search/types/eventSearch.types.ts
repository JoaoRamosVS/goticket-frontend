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

export interface EventSearchFilters {
    venueState: string;
    venueCity: string;
    maxPrice: string;
}
