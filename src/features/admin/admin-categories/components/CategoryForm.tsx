import {
    CheckCircle2,
    Hash,
    Info,
    Loader2,
    Save,
    Tags,
    Trash2,
} from "lucide-react";

import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

type CategoryFormProps = {
    category: EventCategoryDTO | null;
    formName: string;
    isLoading: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    error: string | null;
    successMessage: string | null;
    hasChanges: boolean;
    liveSlug: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    onSave: () => void;
    onDelete: () => void;
};

export const CategoryForm = ({
    category,
    formName,
    isLoading,
    isSaving,
    isDeleting,
    error,
    successMessage,
    hasChanges,
    liveSlug,
    onNameChange,
    onReset,
    onSave,
    onDelete,
}: CategoryFormProps) => {
    return (
        <>
            {error && <Banner variant="error" message={error} />}
            {successMessage && (
                <Banner variant="success" message={successMessage} />
            )}

            {isLoading && !category ? (
                <div className="flex items-center justify-center rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 py-16 text-sm text-[#5e6c87]">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Carregando categoria...
                </div>
            ) : !category ? (
                <div className="rounded-3xl border border-dashed border-red-300/60 bg-red-50/60 p-10 text-center text-sm text-red-500">
                    Não foi possível carregar a categoria.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <GlassCard className="lg:col-span-2">
                        <SectionHeader
                            title="Dados da categoria"
                            description="O slug é gerado automaticamente a partir do nome."
                        />

                        <div className="flex flex-col gap-4">
                            <Field label="Nome" htmlFor="name" required>
                                <TextInput
                                    id="name"
                                    value={formName}
                                    onChange={onNameChange}
                                    placeholder="Nome exibido para a categoria"
                                />
                            </Field>

                            <Field label="Slug" htmlFor="slug">
                                <div className="relative">
                                    <Hash
                                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#2a8fd4]/70"
                                        strokeWidth={2.6}
                                    />
                                    <input
                                        id="slug"
                                        readOnly
                                        value={liveSlug || category.slug}
                                        className="h-11 w-full cursor-not-allowed rounded-2xl border border-white/70 bg-white/40 pl-10 pr-4 text-sm font-mono text-[#5e6c87] backdrop-blur-xl shadow-xs outline-none"
                                    />
                                </div>
                            </Field>
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
                        <MetadataCard category={category} />

                        <DangerCard
                            isDeleting={isDeleting}
                            onDelete={onDelete}
                        />
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

type MetadataCardProps = {
    category: EventCategoryDTO;
};

const MetadataCard = ({ category }: MetadataCardProps) => (
    <GlassCard>
        <SectionHeader title="Metadados" />
        <ul className="flex flex-col gap-2.5 text-sm">
            <MetaRow
                label="ID da categoria"
                value={String(category.categoryId)}
                mono
            />
            <MetaRow label="Nome" value={category.name} />
            <MetaRow label="Slug" value={category.slug} mono />
        </ul>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/40 px-3 py-2.5">
            <Tags className="size-4 text-[#2a8fd4]" />
            <span className="text-[11px] text-[#5e6c87]">
                Categorias são associadas a eventos via cadastro/edição do
                evento.
            </span>
        </div>
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

type DangerCardProps = {
    isDeleting: boolean;
    onDelete: () => void;
};

const DangerCard = ({ isDeleting, onDelete }: DangerCardProps) => (
    <div
        className="rounded-3xl bg-red-50/30 p-6 backdrop-blur-xl"
        style={{
            boxShadow:
                "0 12px 24px -12px rgba(255,50,50,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)",
        }}
    >
        <h2 className="text-lg font-bold text-red-600">
            Remoção de categoria
        </h2>
        <p className="mt-0.5 text-xs text-red-500/80">
            Eventos vinculados a esta categoria podem ficar inconsistentes.
            Use com cuidado.
        </p>
        <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
                boxShadow:
                    "0 6px 18px -4px rgba(255,50,50,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
            }}
        >
            {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Trash2 className="size-4" strokeWidth={2.6} />
            )}
            Excluir categoria
        </button>
    </div>
);
