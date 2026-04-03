import {create} from 'zustand'
import decodeJwtPayload from '@/helpers/DecodeJWT';

interface AuthState {
  isAuth: boolean;
  userFullName: string;
  login: (token: string, expiration: number, userFullName: string) => void;
  logout: () => void;
}

function getNameFromStoredToken(): string {
  const token = localStorage.getItem('accessToken');
  if (!token) return "";
  try {
    const decoded = decodeJwtPayload(token);
    return decoded?.name as string ?? "";
  } catch {
    return "";
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: Boolean(localStorage.getItem('accessToken')),
  userFullName: getNameFromStoredToken(),

  login: (token, expirationTime, userFullName) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      set({isAuth: true, userFullName: userFullName})
  },

  logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      set({isAuth : false})
  },
}))