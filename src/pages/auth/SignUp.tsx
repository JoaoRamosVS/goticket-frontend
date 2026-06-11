import { useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, User, Building2 } from "lucide-react";

import SignUpForm from "@/features/auth/components/SignUpForm";
import OrganizerSignUpForm from "@/features/auth/components/OrganizerSignUpForm";
import useSignUp from "@/features/auth/hooks/useSignUp";
import useOrganizerSignUp from "@/features/auth/hooks/useOrganizerSignUp";

type Mode = "client" | "organizer";

const modeTitleAndDescriptions: Record<Mode, { title: string; description: string }> = {
    client: {
        title: "Cliente",
        description: "Acesse eventos, compre ingressos e gerencie seus pedidos.",
    },
    organizer: {
        title: "Organizador",
        description: "Crie e gerencie seus próprios eventos na plataforma.",
    },
};

const SignUp = () => {
    const [mode, setMode] = useState<Mode>("client");
    const clientHook = useSignUp();
    const organizerHook = useOrganizerSignUp();

    return (
        <div
            className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 py-10"
            style={{ background: "linear-gradient(135deg, #ddf0fa 0%, #f0f8ff 45%, #e3f2fd 100%)" }}
        >
            {/* Floating blobs */}
            <div
                className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(77,184,232,0.4), rgba(42,143,212,0.15))" }}
            />
            <div
                className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(159,210,234,0.35), rgba(87,197,244,0.1))" }}
            />
            <div
                className="pointer-events-none absolute top-1/3 -right-32 h-60 w-60 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(28,111,181,0.18), transparent)" }}
            />

            {/* Glass card */}
            <div
                className="relative z-10 w-full max-w-2xl rounded-4xl border border-white/70 bg-white/25 p-8 backdrop-blur-xl"
                style={{
                    boxShadow:
                        "0 8px 40px -12px rgba(0,46,71,0.14), inset 0 1px 0 0 rgba(255,255,255,0.9)",
                }}
            >
                {/* Brand header */}
                <div className="mb-8 flex items-center gap-4 text-center">
                    <div
                        className="flex p-4 items-center justify-center rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, #4db8e8 0%, #1c6fb5 100%)",
                            boxShadow:
                                "0 6px 18px -4px rgba(42,143,212,0.55), inset 0 1px 0 0 rgba(255,255,255,0.25)",
                        }}
                    >
                        <Ticket className="size-12 text-white" strokeWidth={2.2} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#00334d] text-left">{modeTitleAndDescriptions[mode].title}</h1>
                        <p className="mt-1 text-sm text-[#5e6c87]">{modeTitleAndDescriptions[mode].description}</p>
                    </div>
                </div>

                {/* Role switcher */}
                <div className="mb-7 flex gap-1 rounded-4xl border border-white/70 bg-white/40 p-2 shadow-sm">
                    <RoleTab
                        active={mode === "client"}
                        icon={User}
                        label="Sou um cliente"
                        onClick={() => setMode("client")}
                    />
                    <RoleTab
                        active={mode === "organizer"}
                        icon={Building2}
                        label="Sou um organizador"
                        onClick={() => setMode("organizer")}
                    />
                </div>

                {/* Form */}
                {mode === "client" ? (
                    <SignUpForm
                        email={clientHook.email}
                        password={clientHook.password}
                        fullName={clientHook.fullName}
                        sex={clientHook.sex}
                        identityDocument={clientHook.identityDocument}
                        birthDate={clientHook.birthDate}
                        isLoading={clientHook.isLoading}
                        signUpError={clientHook.signUpError}
                        onEmailChange={clientHook.setEmail}
                        onPasswordChange={clientHook.setPassword}
                        onFullNameChange={clientHook.setFullName}
                        onSexChange={clientHook.setSex}
                        onIdentityDocumentChange={clientHook.setIdentityDocument}
                        onBirthDateChange={clientHook.setBirthDate}
                        onSubmit={clientHook.handleSignUpSubmit}
                    />
                ) : (
                    <OrganizerSignUpForm
                        email={organizerHook.email}
                        password={organizerHook.password}
                        organizerName={organizerHook.organizerName}
                        legalName={organizerHook.legalName}
                        cnpj={organizerHook.cnpj}
                        isLoading={organizerHook.isLoading}
                        signUpError={organizerHook.signUpError}
                        onEmailChange={organizerHook.setEmail}
                        onPasswordChange={organizerHook.setPassword}
                        onOrganizerNameChange={organizerHook.setOrganizerName}
                        onLegalNameChange={organizerHook.setLegalName}
                        onCnpjChange={organizerHook.setCnpj}
                        onSubmit={organizerHook.handleSubmit}
                    />
                )}

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-[#5e6c87]">
                    Já tem uma conta?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#2a8fd4] transition-colors hover:text-[#1c6fb5]"
                    >
                        Fazer login
                    </Link>
                </p>
            </div>
        </div>
    );
};

type RoleTabProps = {
    active: boolean;
    icon: typeof User;
    label: string;
    onClick: () => void;
};

const RoleTab = ({ active, icon: Icon, label, onClick }: RoleTabProps) => (
    <button
        type="button"
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300"
        style={
            active
                ? {
                      background:
                          "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                      color: "#ffffff",
                      boxShadow:
                          "0 4px 14px -3px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.2)",
                  }
                : { color: "#5e6c87" }
        }
    >
        <Icon className="size-4" strokeWidth={2.4} />
        {label}
    </button>
);

export default SignUp;
