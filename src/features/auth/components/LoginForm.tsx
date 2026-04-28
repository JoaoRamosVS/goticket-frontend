import { Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type LoginFormProps = {
    email: string;
    password: string;
    isLoading: boolean;
    loginError: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const LoginForm = ({
    email,
    password,
    isLoading,
    loginError,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: LoginFormProps) => {
    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
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
                        onChange={(e) => onPasswordChange(e.target.value)}
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
                    "Entrar"
                )}
            </Button>
        </form>
    );
};

export default LoginForm;
