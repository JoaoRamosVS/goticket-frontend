import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

type LoginFormProps = {
    email: string;
    password: string;
    isLoading: boolean;
    loginError: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const base =
    "h-11 w-full rounded-2xl border border-white/70 bg-white/60 px-4 text-sm text-[#00334d] placeholder:text-[#5e6c87]/60 shadow-[0_2px_8px_-4px_rgba(0,46,71,0.06)] backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]";

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
        <form className="space-y-5" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1.5">
                <FieldLabel required>E-mail</FieldLabel>
                <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5e6c87]/60" />
                    <input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        required
                        onChange={(e) => onEmailChange(e.target.value)}
                        className={`${base} pl-11`}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <FieldLabel required>Senha</FieldLabel>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5e6c87]/60" />
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        required
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className={`${base} pl-11`}
                    />
                </div>
            </div>

            {loginError && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-red-200/60 bg-red-50/60 px-4 py-3 text-sm text-red-600 backdrop-blur-sm">
                    <AlertCircle className="size-4 shrink-0" />
                    {loginError}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition-all duration-300 hover:brightness-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                    background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                    boxShadow:
                        "0 6px 18px -4px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.2)",
                }}
            >
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {isLoading ? "Carregando..." : "Entrar"}
            </button>
        </form>
    );
};

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
        {children}
        {required && <span className="ml-1 text-[#2a8fd4]">*</span>}
    </span>
);

export default LoginForm;
