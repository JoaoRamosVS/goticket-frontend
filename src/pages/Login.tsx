import { useState } from "react";
import type { LoginRequest } from "@/types";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Mail, Lock, Loader2 } from "lucide-react";

import userService from "@/services/user/index"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

            const response = await userService.login(loginData);

            if(response.accessToken && response.expiresIn) {
                const expirationTime = Date.now() + (response.expiresIn * 1000)

                login(response.accessToken, expirationTime)
                navigate('/home');
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-background via-muted/20 to-background p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
                    <CardDescription className="text-base">
                        Entre com suas credenciais para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {loginError && (
                            <Alert variant="destructive">
                                <AlertDescription>{loginError}</AlertDescription>
                            </Alert>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isLoading}
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Carregando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        Não possui uma conta?{" "}
                        <Link 
                            to={'/cadastro'} 
                            className="font-medium text-primary hover:underline underline-offset-4"
                        >
                            Cadastre-se
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}