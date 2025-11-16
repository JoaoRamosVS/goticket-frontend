import goTicketApi from "../api";
import type { EventMinListDTO } from "../../types";

const getEvents = async (page: number, pageSize: number): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get('/events', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        params: {
            page,
            pageSize
        }
    });

    return response.data as EventMinListDTO;
};

export default {getEvents}