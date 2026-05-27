import { z } from "zod";
import { STUDENT_ELIGIBILITY_NAME } from "./eligibility.constants";
import { cpfSchema } from "@/utils/validation";

const holderSchema = z
  .object({
    ticketType: z.enum(["FULL", "HALF", "SOLIDARY"]),
    batchAllotmentId: z.number(),
    ticketTypeId: z.number(),
    holderName: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(200, "Nome muito longo"),
    holderDocument: cpfSchema,
    eligibilityTypeId: z.number().nullable(),
    eligibilityTypeName: z.string().nullable(),
    eligibilityDocumentNumber: z.string().max(50).nullable(),
  })
  .refine(
    (h) => h.ticketType !== "HALF" || h.eligibilityTypeId !== null,
    {
      message: "Selecione a categoria da meia-entrada",
      path: ["eligibilityTypeId"],
    }
  )
  .refine(
    (h) =>
      h.eligibilityTypeName !== STUDENT_ELIGIBILITY_NAME ||
      (h.eligibilityDocumentNumber?.trim().length ?? 0) > 0,
    {
      message: "Informe o documento da meia-entrada (ex: matrícula)",
      path: ["eligibilityDocumentNumber"],
    }
  );

export const checkoutFormSchema = z.object({
  eventDateId: z.number(),
  holders: z.array(holderSchema).min(1).max(10),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>;
