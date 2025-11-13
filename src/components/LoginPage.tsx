import { useState } from "react";
import type { LoginRequest } from "../types";
import api from "../services/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

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

            if(response.accessToken) {
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
                />

                <input className="border border-gray-300 rounded-md p-2"
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="bg-blue-500 text-white rounded-md p-2 cursor-pointer" disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Login'}
                </button>

                {loginError && <p className="text-red-500">{loginError}</p>}
            </form>
        </div>
    )
}