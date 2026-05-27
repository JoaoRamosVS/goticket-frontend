import { Loader2, MapPin } from "lucide-react";
import type { NewVenueFormState } from "@/features/admin/admin-venues/new-venue/types/newVenue.types";
import { BRAZILIAN_STATES } from "@/utils/validation";

const fieldClass =
    "w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-2.5 text-sm text-[#00334d] shadow-[0_4px_20px_-8px_rgba(28,111,181,0.25)] backdrop-blur-xl outline-none transition-all duration-300 placeholder:text-[#5e6c87]/55 focus:border-[#2a8fd4]/60 focus:bg-white/85 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]";

type Props = {
    form: NewVenueFormState;
    isCepLoading: boolean;
    cepError: string | null;
    onChange: <K extends keyof NewVenueFormState>(
        field: K
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const FieldLabel = ({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) => (
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
        {children}
        {required && <span className="ml-1 text-[#2a8fd4]">*</span>}
    </span>
);

export function StepAddress({ form, isCepLoading, cepError, onChange }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto]">
                <label className="flex flex-col">
                    <FieldLabel required>CEP</FieldLabel>
                    <div className="relative">
                        <input
                            className={`${fieldClass} h-11 pr-10`}
                            value={form.zipCode}
                            onChange={onChange("zipCode")}
                            placeholder="00000-000"
                            maxLength={9}
                            inputMode="numeric"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            {isCepLoading ? (
                                <Loader2 className="size-4 animate-spin text-[#2a8fd4]" />
                            ) : (
                                <MapPin className="size-4 text-[#5e6c87]/40" />
                            )}
                        </div>
                    </div>
                    {cepError && (
                        <p className="mt-1 text-[11px] text-red-400">{cepError}</p>
                    )}
                </label>
                <label className="flex flex-col">
                    <FieldLabel required>Logradouro</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.streetAddress}
                        onChange={onChange("streetAddress")}
                        placeholder="Rua, avenida..."
                    />
                </label>
                <label className="flex flex-col sm:w-32">
                    <FieldLabel required>Número</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.streetAddressNumber}
                        onChange={onChange("streetAddressNumber")}
                        placeholder="Nº"
                    />
                </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                    <FieldLabel required>Bairro</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.neighborhood}
                        onChange={onChange("neighborhood")}
                    />
                </label>
                <label className="flex flex-col">
                    <FieldLabel required>Cidade</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.city}
                        onChange={onChange("city")}
                    />
                </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                    <FieldLabel required>Estado</FieldLabel>
                    <select
                        className={`${fieldClass} h-11`}
                        value={form.state}
                        onChange={onChange("state")}
                    >
                        <option value="">Selecione</option>
                        {BRAZILIAN_STATES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col">
                    <FieldLabel required>País</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.country}
                        onChange={onChange("country")}
                    />
                </label>
            </div>
        </div>
    );
}
