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

    if (response.status === 200) {
        const { accessToken, expiresIn } = response.data;     
        
        const expirationTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        localStorage.setItem('accessToken', accessToken);
    }

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