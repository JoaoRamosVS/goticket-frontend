import { Mail, Lock, User, Calendar, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SignUpFormProps = {
    email: string;
    password: string;
    fullName: string;
    sex: number;
    identityDocument: string;
    birthDate: string;
    isLoading: boolean;
    signUpError: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onFullNameChange: (value: string) => void;
    onSexChange: (value: number) => void;
    onIdentityDocumentChange: (value: string) => void;
    onBirthDateChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const SignUpForm = ({
    email,
    password,
    fullName,
    sex,
    identityDocument,
    birthDate,
    isLoading,
    signUpError,
    onEmailChange,
    onPasswordChange,
    onFullNameChange,
    onSexChange,
    onIdentityDocumentChange,
    onBirthDateChange,
    onSubmit,
}: SignUpFormProps) => {
    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="João Silva"
                            value={fullName}
                            required
                            onChange={(e) => onFullNameChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            required
                            onChange={(e) => onEmailChange(e.target.value.toLowerCase())}
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
                            required
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="identityDocument">CPF</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="identityDocument"
                            type="text"
                            required
                            placeholder="000.000.000-00"
                            value={identityDocument}
                            onChange={(e) => onIdentityDocumentChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de nascimento</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            id="birthDate"
                            type="date"
                            required
                            value={birthDate}
                            onChange={(e) => onBirthDateChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sex">Sexo</Label>
                    <Select
                        value={sex.toString()}
                        onValueChange={(value) => onSexChange(Number(value))}
                    >
                        <SelectTrigger id="sex" className="w-full">
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3">Não informado</SelectItem>
                            <SelectItem value="1">Masculino</SelectItem>
                            <SelectItem value="2">Feminino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {signUpError && (
                <Alert variant="destructive">
                    <AlertDescription>{signUpError}</AlertDescription>
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
                    "Criar conta"
                )}
            </Button>
        </form>
    );
};

export default SignUpForm;
