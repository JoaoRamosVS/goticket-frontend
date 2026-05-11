import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/auth.service";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/stores/authStore";
import decodeJwtPayload from "@/utils/DecodeJWT";

const useLogin = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError("");

        try {
            const loginData: LoginRequest = {
                email,
                password,
            };

            const response: LoginResponse = await authService.login(loginData);

            if (response.accessToken && response.expiresIn && response.refreshToken) {
                const expirationTime = Date.now() + response.expiresIn * 1000;
                const decodedPayload = decodeJwtPayload(response.accessToken);

                login(
                    response.accessToken,
                    response.refreshToken,
                    expirationTime,
                    decodedPayload.name as string
                );

                const scope = decodedPayload.scope as string | undefined;
                if (scope === "ORGANIZER") {
                    navigate("/organizer/dashboard");
                } else if (scope === "ADMIN") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            if (
                error instanceof AxiosError &&
                (error.response?.status === 401 || error.response?.status === 403)
            ) {
                setLoginError("Email ou senha inválidos");
            } else {
                setLoginError("Ocorreu um erro ao fazer login");
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        isLoading,
        loginError,
        setEmail,
        setPassword,
        handleLoginSubmit,
    };
};

export default useLogin;

