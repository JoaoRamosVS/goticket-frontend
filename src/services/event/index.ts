import goTicketApi from "../api";
import type { EventMinListDTO } from "../../types";

const getEvents = async (): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get('/events', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    return response.data as EventMinListDTO;
};

export default {getEvents}