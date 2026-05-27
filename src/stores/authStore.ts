import {create} from 'zustand'
import decodeJwtPayload from '@/utils/DecodeJWT';

interface AuthState {
  isAuth: boolean;
  userScope: string | null;
  userFullName: string;
  login: (accessToken: string, refreshToken: string, expiration: number, userFullName: string) => void;
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

function getScopeFromStoredToken(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const decoded = decodeJwtPayload(token);
    return typeof decoded.scope === 'string' ? decoded.scope : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: Boolean(localStorage.getItem('accessToken')),
  userScope: getScopeFromStoredToken(),
  userFullName: getNameFromStoredToken(),

  login: (token, refreshToken, expirationTime, userFullName) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    let userScope: string | null = null;
    try {
      const decoded = decodeJwtPayload(token);
      userScope = typeof decoded.scope === 'string' ? decoded.scope : null;
    } catch { /* token malformado — userScope permanece null */ }
    set({ isAuth: true, userFullName, userScope });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    set({ isAuth: false, userScope: null });
  },
}))
