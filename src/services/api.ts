import axios from 'axios';
import type { EventMinListDTO, LoginRequest, LoginResponse, UserDTO } from '../types';

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

const getUser = async(): Promise<UserDTO> => {
    const response = await goTicketApi.get('/user', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });

    return response.data as UserDTO;
}

export default { login, getEvents, getUser };