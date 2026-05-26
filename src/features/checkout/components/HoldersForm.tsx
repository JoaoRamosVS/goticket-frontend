import type { UseFieldArrayReturn } from "react-hook-form";
import type { CheckoutFormData } from "../types/checkout-form.types";
import type { EligibilityTypeDTO } from "../types/order-api.types";
import HolderItemFields from "./HolderItemFields";

interface HoldersFormProps {
  fields: UseFieldArrayReturn<CheckoutFormData, "holders">["fields"];
  eligibilityTypes: EligibilityTypeDTO[];
}

export default function HoldersForm({ fields, eligibilityTypes }: HoldersFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Dados dos portadores</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha nome e documento de cada ingresso selecionado.
        </p>
      </div>

      {fields.map((field, index) => (
        // key usa field.id (gerado pelo RHF) — nunca index
        <HolderItemFields
          key={field.id}
          index={index}
          eligibilityTypes={eligibilityTypes}
        />
      ))}
    </div>
  );
}
