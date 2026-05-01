import type { NewVenueFormState } from "@/features/admin/admin-venues/new-venue/types/newVenue.types";

const fieldClass =
    "w-full rounded-2xl border border-white/80 bg-white/55 px-4 py-2.5 text-sm text-[#00334d] shadow-[0_4px_20px_-8px_rgba(28,111,181,0.25)] backdrop-blur-xl outline-none transition-all duration-300 placeholder:text-[#5e6c87]/55 focus:border-[#2a8fd4]/60 focus:bg-white/85 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12),0_8px_28px_-12px_rgba(0,51,77,0.2)]";

type Props = {
    form: NewVenueFormState;
    onChange: <K extends keyof NewVenueFormState>(
        field: K
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

export function StepIdentification({ form, onChange }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col">
                    <FieldLabel required>Nome fantasia</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.name}
                        onChange={onChange("name")}
                        placeholder="Nome comercial do espaço"
                    />
                </label>
                <label className="flex flex-col">
                    <FieldLabel required>Razão social</FieldLabel>
                    <input
                        className={`${fieldClass} h-11`}
                        value={form.legalName}
                        onChange={onChange("legalName")}
                        placeholder="Razão social registrada"
                    />
                </label>
            </div>
            <label className="flex flex-col">
                <FieldLabel required>CNPJ</FieldLabel>
                <input
                    className={`${fieldClass} h-11`}
                    value={form.CNPJ}
                    onChange={onChange("CNPJ")}
                    placeholder="Somente números ou formatado"
                    maxLength={18}
                />
            </label>
            <label className="flex flex-col">
                <FieldLabel>Descrição</FieldLabel>
                <textarea
                    className={`${fieldClass} min-h-[120px] resize-y py-3`}
                    value={form.description}
                    onChange={onChange("description")}
                    placeholder="Diferenciais, público-alvo, notas internas..."
                    rows={4}
                />
            </label>
        </div>
    );
}
