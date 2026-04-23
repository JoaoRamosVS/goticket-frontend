import goTicketApi from "@/services/api";
import type { EventMinListDTO } from "@/types";

const getEvents = async (
    page: number,
    pageSize: number,
    signal?: AbortSignal
): Promise<EventMinListDTO> => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await goTicketApi.get<EventMinListDTO>("/events", {
        headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        params: {
            page,
            pageSize,
        },
        signal,
    });

    return response.data;
};

export default { getEvents };
