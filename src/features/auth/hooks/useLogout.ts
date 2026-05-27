import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import goTicketApi from '@/services/api';

export function useLogout() {
  const storeLogout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      await goTicketApi.post('/auth/logout');
    } catch {
      // token já inválido ou rede indisponível — limpa localmente de qualquer forma
    } finally {
      storeLogout();
      navigate('/');
    }
  }, [storeLogout, navigate]);
}
