import goTicketApi from "../api";
import type { ClientDTO, LoginResponse } from "../../types";

const createClient = async (clientData: ClientDTO): Promise<LoginResponse> => {
    const response = await goTicketApi.post('/clients', clientData);

    return response.data as LoginResponse;
}

export default { createClient }