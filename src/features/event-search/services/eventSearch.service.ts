import goTicketApi from "@/services/api";
import type { EventMinListDTO } from "@/features/admin/admin-events/types/event.types";

export interface PublicEventSearchParams {
    title?: string;
    venueState?: string;
    venueCity?: string;
    startingPrice?: number;
    page: number;
    pageSize: number;
}

const searchPublicEvents = async (
    params: PublicEventSearchParams,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const queryParams: Record<string, string | number> = {
        page: params.page,
        pageSize: params.pageSize,
    };

    if (params.title) queryParams.title = params.title;
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

export default { searchPublicEvents };
