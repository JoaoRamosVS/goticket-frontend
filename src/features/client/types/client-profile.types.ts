export interface ClientProfileDTO {
  userId: string;
  email: string;
  fullName: string;
  sex: number;
  identityDocument: string;
  birthDate: string;
  registerDate: string;
  lastUpdateDate: string;
  streetAddress: string | null;
  streetAddressNumber: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  roleName: string | null;
  statusName: string | null;
}

export interface UpdateProfilePayload {
  fullName?: string;
  sex?: number;
}

export interface UpdateAddressPayload {
  streetAddress?: string;
  streetAddressNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
