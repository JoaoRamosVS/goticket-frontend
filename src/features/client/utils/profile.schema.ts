import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
  sex: z.coerce.number().int().min(1).max(2),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
