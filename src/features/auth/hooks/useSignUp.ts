import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/auth.service";
import type { RegisterRequest } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/stores/authStore";
import { maskCpf, stripMask } from "@/utils/validation";

const useSignUp = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [sex, setSex] = useState<number>(3);
    const [identityDocument, setIdentityDocument] = useState("");

    const handleIdentityDocumentChange = (value: string) => {
        setIdentityDocument(maskCpf(value));
    };
    const [birthDate, setBirthDate] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [signUpError, setSignUpError] = useState("");

    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setSignUpError("");

        try {
            const registerData: RegisterRequest = {
                email,
                password,
                fullName,
                sex,
                identityDocument: stripMask(identityDocument),
                birthDate,
            };

            const response = await authService.register(registerData);

            if (response.accessToken && response.expiresIn && response.refreshToken) {
                const expirationTime = Date.now() + response.expiresIn * 1000;

                login(response.accessToken, response.refreshToken, expirationTime, fullName);
                navigate("/home");
            }
        } catch (error) {
            if (
                error instanceof AxiosError &&
                (error.response?.status === 401 || error.response?.status === 403)
            ) {
                setSignUpError("Email ou senha inválidos");
            } else {
                setSignUpError("Ocorreu um erro ao fazer o cadastro");
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        fullName,
        sex,
        identityDocument,
        birthDate,
        isLoading,
        signUpError,
        setEmail,
        setPassword,
        setFullName,
        setSex,
        setIdentityDocument: handleIdentityDocumentChange,
        setBirthDate,
        handleSignUpSubmit,
    };
};

export default useSignUp;
