import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { CheckoutFormData } from "../types/checkout-form.types";
import type { EligibilityTypeDTO } from "../types/order-api.types";
import { TICKET_TYPE_LABELS } from "../utils/ticket-type.constants";
import { STUDENT_ELIGIBILITY_NAME } from "../utils/eligibility.constants";
import EligibilitySelect from "./EligibilitySelect";

interface HolderItemFieldsProps {
  index: number;
  eligibilityTypes: EligibilityTypeDTO[];
}

export default function HolderItemFields({ index, eligibilityTypes }: HolderItemFieldsProps) {
  const { control, setValue } = useFormContext<CheckoutFormData>();
  const ticketType = useWatch({ control, name: `holders.${index}.ticketType` });
  const eligibilityTypeName = useWatch({ control, name: `holders.${index}.eligibilityTypeName` });
  const isHalf = ticketType === "HALF";
  const isStudent = eligibilityTypeName === STUDENT_ELIGIBILITY_NAME;

  const handleEligibilityChange = (id: number, name: string) => {
    setValue(`holders.${index}.eligibilityTypeId`, id, { shouldValidate: true });
    setValue(`holders.${index}.eligibilityTypeName`, name, { shouldValidate: false });
    if (name !== STUDENT_ELIGIBILITY_NAME) {
      setValue(`holders.${index}.eligibilityDocumentNumber`, null, { shouldValidate: false });
    }
  };

  const eligibilityTypeId = useWatch({ control, name: `holders.${index}.eligibilityTypeId` });

  return (
    <div className="rounded-2xl border bg-background/60 backdrop-blur-md p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Ingresso {index + 1}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          {TICKET_TYPE_LABELS[ticketType]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`holders.${index}.holderName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do portador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`holders.${index}.holderDocument`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF / Documento</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isHalf && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`holders.${index}.eligibilityTypeId`}
            render={() => (
              <FormItem>
                <FormLabel>Categoria da meia-entrada</FormLabel>
                <FormControl>
                  <EligibilitySelect
                    eligibilityTypes={eligibilityTypes}
                    value={eligibilityTypeId as number | null}
                    onChange={handleEligibilityChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isStudent && (
            <FormField
              control={control}
              name={`holders.${index}.eligibilityDocumentNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento da meia (ex: matrícula)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nº da matrícula ou documento"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
