import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EligibilityTypeDTO } from "../types/order-api.types";
import { ELIGIBILITY_LABELS } from "../utils/eligibility.constants";

interface EligibilitySelectProps {
  eligibilityTypes: EligibilityTypeDTO[];
  value: number | null;
  onChange: (id: number, name: string) => void;
  disabled?: boolean;
}

export default function EligibilitySelect({
  eligibilityTypes,
  value,
  onChange,
  disabled,
}: EligibilitySelectProps) {
  const handleChange = (raw: string) => {
    const selected = eligibilityTypes.find((e) => String(e.eligibilityTypeId) === raw);
    if (selected) onChange(selected.eligibilityTypeId, selected.name);
  };

  return (
    <Select
      value={value !== null ? String(value) : ""}
      onValueChange={handleChange}
      disabled={disabled || eligibilityTypes.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione a categoria" />
      </SelectTrigger>
      <SelectContent>
        {eligibilityTypes.map((et) => (
          <SelectItem key={et.eligibilityTypeId} value={String(et.eligibilityTypeId)}>
            {ELIGIBILITY_LABELS[et.name] ?? et.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
