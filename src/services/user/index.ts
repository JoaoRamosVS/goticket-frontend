import goTicketApi from "../api";
import type { LoginRequest, LoginResponse, UserDTO } from "../../types";

const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const response = await goTicketApi.post("/login", loginData);
  return response.data as LoginResponse;
};

const getUser = async (): Promise<UserDTO> => {
  const response = await goTicketApi.get("/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response.data as UserDTO;
};

export default { login, getUser };
