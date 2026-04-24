import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    CheckCircle2,
    Info,
    Loader2,
    Pencil,
    Save,
    ShieldCheck,
    ShieldOff,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import organizerService from "@/services/organizer";
import type {
    OrganizerDetailDTO,
    StatusDTO,
    StatusValue,
    UpdateOrganizerPayload,
} from "@/types";

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

const EMPTY_FORM: FormState = {
    email: "",
    organizerName: "",
    legalName: "",
    CNPJ: "",
    streetAddress: "",
    streetAddressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
};

const STATUS_OPTIONS: Record<StatusValue, { statusID: number; name: StatusValue }> = {
    ACTIVE: { statusID: 1, name: "ACTIVE" },
    INACTIVE: { statusID: 2, name: "INACTIVE" },
};

function organizerToFormState(org: OrganizerDetailDTO): FormState {
    return {
        email: org.email ?? "",
        organizerName: org.organizerName ?? "",
        legalName: org.legalName ?? "",
        CNPJ: org.CNPJ ?? "",
        streetAddress: org.streetAddress ?? "",
        streetAddressNumber: org.streetAddressNumber ?? "",
        neighborhood: org.neighborhood ?? "",
        city: org.city ?? "",
        state: org.state ?? "",
        country: org.country ?? "",
        zipCode: org.zipCode ?? "",
    };
}

function normalizeOptional(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
}

function buildPatchPayload(
    form: FormState,
    original: OrganizerDetailDTO
): UpdateOrganizerPayload {
    const payload: UpdateOrganizerPayload = {};

    if (form.email.trim() !== (original.email ?? "")) {
        payload.email = form.email.trim();
    }
    if (form.organizerName.trim() !== (original.organizerName ?? "")) {
        payload.organizerName = form.organizerName.trim();
    }
    if (form.legalName.trim() !== (original.legalName ?? "")) {
        payload.legalName = form.legalName.trim();
    }
    if (form.CNPJ.trim() !== (original.CNPJ ?? "")) {
        payload.CNPJ = form.CNPJ.trim();
    }

    const addressFields: Array<
        keyof Pick<
            FormState,
            | "streetAddress"
            | "streetAddressNumber"
            | "neighborhood"
            | "city"
            | "state"
            | "country"
            | "zipCode"
        >
    > = [
        "streetAddress",
        "streetAddressNumber",
        "neighborhood",
        "city",
        "state",
        "country",
        "zipCode",
    ];

    addressFields.forEach((field) => {
        const next = normalizeOptional(form[field]);
        const current = (original[field] as string | null) ?? null;
        if (next !== current) {
            (payload as Record<string, unknown>)[field] = next;
        }
    });

    return payload;
}

function getAxiosErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as
            | { message?: string; error?: string }
            | undefined;
        return data?.message ?? data?.error ?? err.message ?? fallback;
    }
    return fallback;
}

const EditarOrganizador = () => {
    const navigate = useNavigate();
    const { organizerId } = useParams<{ organizerId: string }>();

    const [organizer, setOrganizer] = useState<OrganizerDetailDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchOrganizer = useCallback(
        (signal?: AbortSignal) => {
            if (!organizerId) return;
            setIsLoading(true);
            setError(null);

            return organizerService
                .getOrganizerById(organizerId, signal)
                .then((data) => {
                    setOrganizer(data);
                    setForm(organizerToFormState(data));
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    setError(
                        getAxiosErrorMessage(
                            err,
                            "Organizador não encontrado."
                        )
                    );
                    setOrganizer(null);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        [organizerId]
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchOrganizer(controller.signal);
        return () => controller.abort();
    }, [fetchOrganizer]);

    useEffect(() => {
        if (!successMessage) return;
        const id = window.setTimeout(() => setSuccessMessage(null), 3500);
        return () => window.clearTimeout(id);
    }, [successMessage]);

    const patchPayload = useMemo(() => {
        if (!organizer) return {};
        return buildPatchPayload(form, organizer);
    }, [form, organizer]);

    const hasChanges = Object.keys(patchPayload).length > 0;

    const handleFieldChange =
        <K extends keyof FormState>(field: K) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleSave = async () => {
        if (!organizer || !organizerId || !hasChanges) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await organizerService.updateOrganizer(
                organizerId,
                patchPayload
            );
            setOrganizer(updated);
            setForm(organizerToFormState(updated));
            setSuccessMessage("Organizador atualizado com sucesso.");
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível atualizar o organizador."
                )
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (organizer) setForm(organizerToFormState(organizer));
    };

    const handleToggleStatus = async (next: StatusValue) => {
        if (!organizer || !organizerId) return;
        if (organizer.status?.name === next) return;

        setIsTogglingStatus(true);
        setError(null);
        try {
            const updated = await organizerService.updateOrganizer(
                organizerId,
                { status: STATUS_OPTIONS[next] as StatusDTO }
            );
            setOrganizer(updated);
            setForm(organizerToFormState(updated));
            setSuccessMessage(
                next === "ACTIVE"
                    ? "Organizador reativado."
                    : "Organizador desativado."
            );
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível alterar o status."
                )
            );
        } finally {
            setIsTogglingStatus(false);
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/organizadores")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para organizadores
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={
                    organizer
                        ? `Editar: ${organizer.organizerName}`
                        : "Editar organizador"
                }
                description={
                    organizer
                        ? `ID ${organizer.userID} · última atualização ${new Date(
                              organizer.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do organizador..."
                }
            />

            {error && <Banner variant="error" message={error} />}
            {successMessage && (
                <Banner variant="success" message={successMessage} />
            )}

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
                                    onChange={handleFieldChange("email")}
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
                                        onChange={handleFieldChange(
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
                                        onChange={handleFieldChange("legalName")}
                                        placeholder="Razão social registrada"
                                    />
                                </Field>
                            </div>

                            <Field label="CNPJ" htmlFor="CNPJ" required>
                                <TextInput
                                    id="CNPJ"
                                    value={form.CNPJ}
                                    onChange={handleFieldChange("CNPJ")}
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
                                            onChange={handleFieldChange(
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
                                            onChange={handleFieldChange(
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
                                            onChange={handleFieldChange(
                                                "neighborhood"
                                            )}
                                        />
                                    </Field>
                                    <Field label="CEP" htmlFor="zipCode">
                                        <TextInput
                                            id="zipCode"
                                            value={form.zipCode}
                                            onChange={handleFieldChange(
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
                                            onChange={handleFieldChange("city")}
                                        />
                                    </Field>
                                    <Field label="Estado" htmlFor="state">
                                        <TextInput
                                            id="state"
                                            value={form.state}
                                            onChange={handleFieldChange("state")}
                                        />
                                    </Field>
                                    <Field label="País" htmlFor="country">
                                        <TextInput
                                            id="country"
                                            value={form.country}
                                            onChange={handleFieldChange(
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
                                onClick={handleReset}
                                disabled={!hasChanges || isSaving}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Descartar alterações
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
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
                            onChange={handleToggleStatus}
                        />

                        <MetadataCard organizer={organizer} />
                    </div>
                </div>
            )}
        </div>
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

type BannerProps = {
    variant: "success" | "error";
    message: string;
};

const Banner = ({ variant, message }: BannerProps) => {
    const isError = variant === "error";
    const Icon = isError ? Info : CheckCircle2;
    return (
        <div
            className={`mb-4 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur-xl ${
                isError
                    ? "border-red-200/80 bg-red-50/80 text-red-600"
                    : "border-emerald-200/80 bg-emerald-50/80 text-emerald-700"
            }`}
        >
            <Icon className="size-4" />
            <span>{message}</span>
        </div>
    );
};

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
                value={organizer.userID ?? "—"}
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

export default EditarOrganizador;
