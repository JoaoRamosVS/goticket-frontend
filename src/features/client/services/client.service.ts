import goTicketApi from "@/services/api";
import type {
  ClientProfileDTO,
  UpdateProfilePayload,
  UpdateAddressPayload,
  UpdatePasswordPayload,
} from "../types/client-profile.types";

async function getMyProfile(signal?: AbortSignal): Promise<ClientProfileDTO> {
  const { data } = await goTicketApi.get<ClientProfileDTO>("/clients/me", { signal });
  return data;
}

async function updateMyProfile(
  clientId: string,
  payload: UpdateProfilePayload | UpdateAddressPayload,
  signal?: AbortSignal
): Promise<void> {
  await goTicketApi.patch(`/clients/${clientId}`, payload, {
    headers: { "Content-Type": "application/merge-patch+json" },
    signal,
  });
}

async function changePassword(
  clientId: string,
  payload: UpdatePasswordPayload,
  signal?: AbortSignal
): Promise<void> {
  await goTicketApi.patch(`/clients/${clientId}/password`, payload, { signal });
}

export default { getMyProfile, updateMyProfile, changePassword };
