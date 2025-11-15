import { useState } from "react";
import type { ClientDTO } from "../types";
import api from "../services/api";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";


const SignUp = () => {
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState<number>(3);
  const [identityDocument, setIdentityDocument] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setsignUpError] = useState("");

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setsignUpError("");

    try {
      const loginData: ClientDTO = {
        email,
        password,
        fullName,
        sex,
        identityDocument,
        birthDate
      };

      const response = await api.createClient(loginData);

      if (response.accessToken && response.expiresIn) {
        const expirationTime = Date.now() + response.expiresIn * 1000;

        login(response.accessToken, expirationTime);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        setsignUpError("Email ou senha inválidos");
      } else {
        setsignUpError("Ocorreu um erro ao fazer o cadastro");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSignUpSubmit}>
        <input
          className="border border-gray-300 rounded-md p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded-md p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded-md p-2"
          type="text"
          placeholder="Nome completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <select
            className="border border-gray-300 rounded-md p-2"
            value={sex}
            onChange={(e) => setSex(Number(e.target.value))}
        >
            <option value={3}>Não informado</option>
            <option value={1}>Masculino</option>
            <option value={2}>Feminino</option>
        </select>

        <input
          className="border border-gray-300 rounded-md p-2"
          type="text"
          placeholder="Documento de identificação (CPF)"
          value={identityDocument}
          onChange={(e) => setIdentityDocument(e.target.value)}
        />

        <input
          className="border border-gray-300 rounded-md p-2"
          type="date"
          placeholder="Data de nascimento"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Criar conta"}
        </button>

        {signUpError && <p className="text-red-500">{signUpError}</p>}
      </form>
      <p className="my-6">
        Já possui uma conta? <Link to={"/login"} className="underline text-blue-400">Fazer Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
