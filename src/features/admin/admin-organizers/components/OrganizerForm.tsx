import {
    Loader2,
    Save,
    ShieldCheck,
    ShieldOff,
} from "lucide-react";
import type {
    OrganizerDetailDTO,
    StatusValue,
} from "@/features/admin/admin-organizers/types/organizer.types";

type FormState = {
    email: string;
    organizerName: string;
    legalName: string;
    CNPJ: string;
    streetAddress: string;
    streetAddressNumber: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
};

type OrganizerFormProps = {
    organizer: OrganizerDetailDTO | null;
    form: FormState;
    isLoading: boolean;
    isSaving: boolean;
    isTogglingStatus: boolean;
    hasChanges: boolean;
    onFieldChange: <K extends keyof FormState>(
        field: K
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onReset: () => void;
    onToggleStatus: (value: StatusValue) => void;
};

export const OrganizerForm = ({
    organizer,
    form,
    isLoading,
    isSaving,
    isTogglingStatus,
    hasChanges,
    onFieldChange,
    onSave,
    onReset,
    onToggleStatus,
}: OrganizerFormProps) => {
    return (
        <>
            {isLoading && !organizer ? (
                <div className="flex items-center justify-center rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 py-16 text-sm text-[#5e6c87]">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Carregando organizador...
                </div>
            ) : !organizer ? (
                <div className="rounded-3xl border border-dashed border-red-300/60 bg-red-50/60 p-10 text-center text-sm text-red-500">
                    Não foi possível carregar o organizador.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <GlassCard className="lg:col-span-2">
                        <SectionHeader
                            title="Dados da empresa"
                            description="Informações cadastrais e fiscais do organizador."
                        />

                        <div className="flex flex-col gap-4">
                            <Field label="E-mail" htmlFor="email" required>
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={onFieldChange("email")}
                                    placeholder="contato@organizador.com"
                                />
                            </Field>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Nome fantasia"
                                    htmlFor="organizerName"
                                    required
                                >
                                    <TextInput
                                        id="organizerName"
                                        value={form.organizerName}
                                        onChange={onFieldChange(
                                            "organizerName"
                                        )}
                                        placeholder="Nome comercial"
                                    />
                                </Field>
                                <Field
                                    label="Razão social"
                                    htmlFor="legalName"
                                    required
                                >
                                    <TextInput
                                        id="legalName"
                                        value={form.legalName}
                                        onChange={onFieldChange("legalName")}
                                        placeholder="Razão social registrada"
                                    />
                                </Field>
                            </div>

                            <Field label="CNPJ" htmlFor="CNPJ" required>
                                <TextInput
                                    id="CNPJ"
                                    value={form.CNPJ}
                                    onChange={onFieldChange("CNPJ")}
                                    placeholder="00.000.000/0000-00"
                                    maxLength={18}
                                />
                            </Field>
                        </div>

                        <div className="mt-8">
                            <SectionHeader
                                title="Endereço"
                                description="Endereço comercial do organizador (opcional)."
                            />

                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                                    <Field
                                        label="Logradouro"
                                        htmlFor="streetAddress"
                                    >
                                        <TextInput
                                            id="streetAddress"
                                            value={form.streetAddress}
                                            onChange={onFieldChange(
                                                "streetAddress"
                                            )}
                                            placeholder="Rua, Avenida..."
                                        />
                                    </Field>
                                    <Field
                                        label="Número"
                                        htmlFor="streetAddressNumber"
                                    >
                                        <TextInput
                                            id="streetAddressNumber"
                                            value={form.streetAddressNumber}
                                            onChange={onFieldChange(
                                                "streetAddressNumber"
                                            )}
                                            placeholder="Nº"
                                            className="sm:w-28"
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field
                                        label="Bairro"
                                        htmlFor="neighborhood"
                                    >
                                        <TextInput
                                            id="neighborhood"
                                            value={form.neighborhood}
                                            onChange={onFieldChange(
                                                "neighborhood"
                                            )}
                                        />
                                    </Field>
                                    <Field label="CEP" htmlFor="zipCode">
                                        <TextInput
                                            id="zipCode"
                                            value={form.zipCode}
                                            onChange={onFieldChange(
                                                "zipCode"
                                            )}
                                            placeholder="00000-000"
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <Field label="Cidade" htmlFor="city">
                                        <TextInput
                                            id="city"
                                            value={form.city}
                                            onChange={onFieldChange("city")}
                                        />
                                    </Field>
                                    <Field label="Estado" htmlFor="state">
                                        <TextInput
                                            id="state"
                                            value={form.state}
                                            onChange={onFieldChange("state")}
                                        />
                                    </Field>
                                    <Field label="País" htmlFor="country">
                                        <TextInput
                                            id="country"
                                            value={form.country}
                                            onChange={onFieldChange(
                                                "country"
                                            )}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onReset}
                                disabled={!hasChanges || isSaving}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Descartar alterações
                            </button>
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={!hasChanges || isSaving}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                    boxShadow:
                                        "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                }}
                            >
                                {isSaving ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" strokeWidth={2.6} />
                                )}
                                Salvar alterações
                            </button>
                        </div>
                    </GlassCard>

                    <div className="flex flex-col gap-5">
                        <StatusCard
                            current={organizer.status?.name ?? "ACTIVE"}
                            isLoading={isTogglingStatus}
                            onChange={onToggleStatus}
                        />

                        <MetadataCard organizer={organizer} />
                    </div>
                </div>
            )}
        </>
    );
};

type GlassCardProps = {
    className?: string;
    children: React.ReactNode;
};

const GlassCard = ({ className = "", children }: GlassCardProps) => (
    <div
        className={`rounded-3xl border border-white/70 bg-white/15 p-6 backdrop-blur-xl shadow-xl  ${className}`}
        style={{
            boxShadow:
                "0 8px 28px -10px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.85)",
        }}
    >
        {children}
    </div>
);

type SectionHeaderProps = {
    title: string;
    description?: string;
};

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
    <div className="mb-5">
        <h2 className="text-lg font-bold text-[#00334d]">{title}</h2>
        {description && (
            <p className="mt-0.5 text-xs text-[#5e6c87]">{description}</p>
        )}
    </div>
);

type FieldProps = {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
};

const Field = ({ label, htmlFor, required, children }: FieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label
            htmlFor={htmlFor}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]"
        >
            {label}
            {required && <span className="ml-1 text-[#2a8fd4]">*</span>}
        </label>
        {children}
    </div>
);

const baseInputClasses =
    "w-full rounded-2xl border border-white/70 bg-white/60 shadow-xs px-4 py-2.5 text-sm text-[#00334d] placeholder:text-[#5e6c87]/60 backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]";

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`${baseInputClasses} h-11 ${props.className ?? ""}`}
    />
);

type StatusCardProps = {
    current: StatusValue;
    isLoading: boolean;
    onChange: (value: StatusValue) => void;
};

const StatusCard = ({ current, isLoading, onChange }: StatusCardProps) => {
    const isActive = current === "ACTIVE";
    return (
        <GlassCard>
            <SectionHeader
                title="Status da conta"
                description="Defina se o organizador pode acessar a plataforma."
            />

            <div className="flex gap-2">
                <StatusButton
                    active={isActive}
                    onClick={() => onChange("ACTIVE")}
                    disabled={isLoading || isActive}
                    icon={ShieldCheck}
                    label="Ativo"
                />
                <StatusButton
                    active={!isActive}
                    onClick={() => onChange("INACTIVE")}
                    disabled={isLoading || !isActive}
                    icon={ShieldOff}
                    label="Inativo"
                />
            </div>

            {isLoading && (
                <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#5e6c87]">
                    <Loader2 className="size-3 animate-spin" />
                    Atualizando status...
                </p>
            )}
        </GlassCard>
    );
};

type StatusButtonProps = {
    active: boolean;
    onClick: () => void;
    disabled: boolean;
    icon: typeof ShieldCheck;
    label: string;
};

const StatusButton = ({
    active,
    onClick,
    disabled,
    icon: Icon,
    label,
}: StatusButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed ${
            active
                ? "text-white"
                : "border border-white/70 bg-white/60 text-[#00334d] hover:bg-white"
        } ${disabled && !active ? "opacity-50" : ""}`}
        style={
            active
                ? {
                      background:
                          "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                      boxShadow:
                          "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                  }
                : undefined
        }
    >
        <Icon className="size-4" strokeWidth={2.6} />
        {label}
    </button>
);

type MetadataCardProps = {
    organizer: OrganizerDetailDTO;
};

const MetadataCard = ({ organizer }: MetadataCardProps) => (
    <GlassCard>
        <SectionHeader title="Metadados" />
        <ul className="flex flex-col gap-2.5 text-sm">
            <MetaRow label="Papel" value={organizer.role?.name ?? "—"} />
            <MetaRow
                label="ID do usuário"
                value={organizer.userId ?? "—"}
                mono
            />
            <MetaRow
                label="Cadastrado em"
                value={
                    organizer.registerDate
                        ? new Date(organizer.registerDate).toLocaleString(
                              "pt-BR"
                          )
                        : "—"
                }
            />
            <MetaRow
                label="Atualizado em"
                value={
                    organizer.lastUpdateDate
                        ? new Date(organizer.lastUpdateDate).toLocaleString(
                              "pt-BR"
                          )
                        : "—"
                }
            />
        </ul>
    </GlassCard>
);

type MetaRowProps = {
    label: string;
    value: string;
    mono?: boolean;
};

const MetaRow = ({ label, value, mono }: MetaRowProps) => (
    <li className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
            {label}
        </span>
        <span
            className={`text-right text-sm font-semibold text-[#00334d] ${
                mono ? "break-all font-mono text-[11px]" : ""
            }`}
        >
            {value}
        </span>
    </li>
);
