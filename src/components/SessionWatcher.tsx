import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SessionWatcher = () => {
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
          localStorage.removeItem("tokenExpiration");
          localStorage.removeItem("accessToken");
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
