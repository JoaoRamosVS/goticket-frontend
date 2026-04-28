import { Link } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import SignUpForm from "@/features/auth/components/SignUpForm";
import useSignUp from "@/features/auth/hooks/useSignUp";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
    const {
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
        setIdentityDocument,
        setBirthDate,
        handleSignUpSubmit,
    } = useSignUp();

    return (
        <AuthLayout>
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Criar conta</CardTitle>
                    <CardDescription className="text-base">
                        Preencha os dados abaixo para criar sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignUpForm
                        email={email}
                        password={password}
                        fullName={fullName}
                        sex={sex}
                        identityDocument={identityDocument}
                        birthDate={birthDate}
                        isLoading={isLoading}
                        signUpError={signUpError}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onFullNameChange={setFullName}
                        onSexChange={setSex}
                        onIdentityDocumentChange={setIdentityDocument}
                        onBirthDateChange={setBirthDate}
                        onSubmit={handleSignUpSubmit}
                    />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-muted-foreground">
                        Já possui uma conta?{" "}
                        <Link
                            to={"/login"}
                            className="font-medium text-primary hover:underline underline-offset-4"
                        >
                            Fazer Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
};

export default SignUp;
