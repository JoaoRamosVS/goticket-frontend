import { Link } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";
import useLogin from "@/features/auth/hooks/useLogin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    const {
        email,
        password,
        isLoading,
        loginError,
        setEmail,
        setPassword,
        handleLoginSubmit,
    } = useLogin();

    return (
        <AuthLayout>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
                    <CardDescription className="text-base">
                        Entre com suas credenciais para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm
                        email={email}
                        password={password}
                        isLoading={isLoading}
                        loginError={loginError}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onSubmit={handleLoginSubmit}
                    />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        Não possui uma conta?{" "}
                        <Link
                            to={"/cadastro"}
                            className="font-medium text-primary hover:underline underline-offset-4"
                        >
                            Cadastre-se
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}
