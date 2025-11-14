import {create} from 'zustand'

interface AuthState {
    isAuth: boolean;
    login: (token: string, expiration: number) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: Boolean(localStorage.getItem('accessToken')),

    login: (token, expirationTime) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        set({isAuth: true})
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpiration');
        set({isAuth : false})
    },
}))