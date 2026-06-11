import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/auth.service";
import type { OrganizerRegisterRequest } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/stores/authStore";
import { maskCnpj, stripMask } from "@/utils/validation";

const useOrganizerSignUp = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizerName, setOrganizerName] = useState("");
    const [legalName, setLegalName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [signUpError, setSignUpError] = useState("");

    const handleCnpjChange = (value: string) => {
        setCnpj(maskCnpj(value));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setSignUpError("");

        try {
            const data: OrganizerRegisterRequest = {
                email,
                password,
                organizerName,
                legalName,
                CNPJ: stripMask(cnpj),
            };

            const response = await authService.registerOrganizer(data);

            if (response.accessToken && response.expiresIn && response.refreshToken) {
                const expirationTime = Date.now() + response.expiresIn * 1000;
                login(response.accessToken, response.refreshToken, expirationTime, organizerName);
                navigate("/organizer/dashboard");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const msgs: string[] | undefined = error.response?.data?.errors;
                if (Array.isArray(msgs) && msgs.length > 0) {
                    setSignUpError(msgs[0]);
                } else {
                    setSignUpError("Ocorreu um erro ao fazer o cadastro.");
                }
            } else {
                setSignUpError("Ocorreu um erro ao fazer o cadastro.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        organizerName,
        legalName,
        cnpj,
        isLoading,
        signUpError,
        setEmail,
        setPassword,
        setOrganizerName,
        setLegalName,
        setCnpj: handleCnpjChange,
        handleSubmit,
    };
};

export default useOrganizerSignUp;
