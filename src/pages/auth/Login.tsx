import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

import LoginForm from "@/features/auth/components/LoginForm";
import useLogin from "@/features/auth/hooks/useLogin";

export default function Login() {
    const { email, password, isLoading, loginError, setEmail, setPassword, handleLoginSubmit } =
        useLogin();

    return (
        <div
            className="relative min-h-screen overflow-hidden flex items-center justify-center p-4"
            style={{ background: "linear-gradient(135deg, #ddf0fa 0%, #f0f8ff 45%, #e3f2fd 100%)" }}
        >
            {/* Floating blobs */}
            <div
                className="pointer-events-none absolute -top-32 -left-32 h-112 w-md rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(77,184,232,0.45), rgba(42,143,212,0.12))" }}
            />
            <div
                className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(159,210,234,0.4), rgba(87,197,244,0.08))" }}
            />
            <div
                className="pointer-events-none absolute bottom-1/3 -left-20 h-52 w-52 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(28,111,181,0.16), transparent)" }}
            />

            {/* Glass card */}
            <div
                className="relative z-10 w-full max-w-md rounded-4xl border border-white/70 bg-white/25 p-8 backdrop-blur-xl"
                style={{
                    boxShadow:
                        "0 8px 40px -12px rgba(0,46,71,0.14), inset 0 1px 0 0 rgba(255,255,255,0.9)",
                }}
            >
                {/* Brand header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div
                        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, #4db8e8 0%, #1c6fb5 100%)",
                            boxShadow:
                                "0 6px 20px -4px rgba(42,143,212,0.6), inset 0 1px 0 0 rgba(255,255,255,0.25)",
                        }}
                    >
                        <Ticket className="size-8 text-white" strokeWidth={2.2} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#00334d]">
                        Bem-vindo de volta
                    </h1>
                    <p className="mt-1.5 text-sm text-[#5e6c87]">
                        Entre com suas credenciais para continuar
                    </p>
                </div>

                <LoginForm
                    email={email}
                    password={password}
                    isLoading={isLoading}
                    loginError={loginError}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleLoginSubmit}
                />

                <p className="mt-6 text-center text-sm text-[#5e6c87]">
                    Não possui uma conta?{" "}
                    <Link
                        to="/cadastro"
                        className="font-semibold text-[#2a8fd4] transition-colors hover:text-[#1c6fb5]"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}
