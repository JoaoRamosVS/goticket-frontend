import { z } from "zod";

export const addressSchema = z.object({
  streetAddress: z.string().optional(),
  streetAddressNumber: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
