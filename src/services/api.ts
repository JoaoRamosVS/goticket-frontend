import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const goTicketApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// gerenciar múltiplas requisições enquanto o token é atualizado
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// injeta o Access Token em todas as chamadas
goTicketApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// trata o 401 e faz o refresh
goTicketApi.interceptors.response.use(
    (response) => {
        return response; // se deu sucesso, só retorna a resposta
    },
    async (error) => {
        const originalRequest = error.config;

        // erro 401 e ainda não foi refeita a requisição
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // se já estiver fazendo o refresh, coloca a requisição na fila
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return goTicketApi(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            try {
                // Tenta fazer o refresh na rota do backend (usamos axios direto para não cair no interceptor)
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

                // atualiza os tokens no localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                localStorage.setItem('tokenExpiration', expiresIn.toString());

                // refaz a requisição original com o novo token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return goTicketApi(originalRequest);

            } catch (err) {
                // se o refresh token for inválido/expirado, desloga e limpa a fila
                processQueue(err, null);
                useAuthStore.getState().logout(); 
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default goTicketApi;