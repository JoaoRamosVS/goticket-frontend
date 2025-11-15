import { useState } from "react";
import type { LoginRequest } from "../types";
import api from "../services/api";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Login() {

    const login = useAuthStore((state) => state.login)

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError('');
        
        try {
            const loginData: LoginRequest = {
                email,
                password
            };

            const response = await api.login(loginData);

            if(response.accessToken && response.expiresIn) {
                const expirationTime = Date.now() + (response.expiresIn * 1000)

                login(response.accessToken, expirationTime)
                navigate('/dashboard');
            }

        } catch (error) {
            if (error instanceof AxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
                setLoginError('Email ou senha inválidos');
            } else {
                setLoginError('Ocorreu um erro ao fazer login');
                console.error(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                <input className="border border-gray-300 rounded-md p-2"
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input className="border border-gray-300 rounded-md p-2"
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="bg-blue-500 text-white rounded-md p-2 cursor-pointer" disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Login'}
                </button>

                {loginError && <p className="text-red-500">{loginError}</p>}
            </form>
            <p className="my-6">Não possui uma conta? <Link to={'/cadastro'} className="underline text-blue-400">Cadastre-se</Link></p>
        </div>
    )
}