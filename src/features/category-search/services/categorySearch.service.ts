import goTicketApi from "@/services/api";
import type { EventMinListDTO } from "@/features/admin/admin-events/types/event.types";

export interface CategoryEventsParams {
    categoryId: number;
    venueState?: string;
    venueCity?: string;
    startingPrice?: number;
    page: number;
    pageSize: number;
}

const fetchEventsByCategory = async (
    params: CategoryEventsParams,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const queryParams: Record<string, string | number> = {
        categoryId: params.categoryId,
        page: params.page,
        pageSize: params.pageSize,
    };

    if (params.venueState) queryParams.venueState = params.venueState;
    if (params.venueCity) queryParams.venueCity = params.venueCity;
    if (params.startingPrice !== undefined)
        queryParams.startingPrice = params.startingPrice;

    const response = await goTicketApi.get<EventMinListDTO>("/events", {
        params: queryParams,
        signal,
    });

    return response.data;
};

export default { fetchEventsByCategory };
