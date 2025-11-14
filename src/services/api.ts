import axios from 'axios';
import type { EventMinListDTO, LoginRequest, LoginResponse } from '../types';

const goTicketApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await goTicketApi.post('/login', loginData);
    return response.data as LoginResponse;
};

const getEvents = async (): Promise<EventMinListDTO> => {
    const response = await goTicketApi.get('/events', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    return response.data as EventMinListDTO;
};

export default { login, getEvents };