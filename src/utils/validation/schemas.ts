import { z } from "zod";
import { stripMask } from "./masks";
import { isValidCpf, isValidCnpj } from "./validators";

export const cpfSchema = z
  .string()
  .transform((v) => stripMask(v))
  .pipe(
    z
      .string()
      .length(11, "CPF deve ter 11 dígitos")
      .refine(isValidCpf, "CPF inválido")
  );

export const cnpjSchema = z
  .string()
  .transform((v) => stripMask(v))
  .pipe(
    z
      .string()
      .length(14, "CNPJ deve ter 14 dígitos")
      .refine(isValidCnpj, "CNPJ inválido")
  );
