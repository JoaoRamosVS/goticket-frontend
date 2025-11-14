import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const SessionWatcher = () => {
  
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const expirationSorted = localStorage.getItem("tokenExpiration");

      if (!expirationSorted && location.pathname !== "/login") {
        return;
      }

      if (expirationSorted) {
        const now = Date.now();
        const expirationTime = Number(expirationSorted);

        if (now >= expirationTime) {
          logout();
          navigate("/login");
        }
      }
    };

    const intervalID = setInterval(checkSession, 1000);
    checkSession();

    return () => clearInterval(intervalID);
  }, [navigate, location]);

  return null;
};

export default SessionWatcher;
