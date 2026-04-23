import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    ImagePlus,
    Info,
    Loader2,
    Pencil,
    Save,
    Star,
    Trash2,
    Upload,
    X,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import eventService from "@/services/event";
import { buildEventImageUrl } from "@/helpers/events";
import type {
    EventDetailDTO,
    EventVisibilityValue,
    UpdateEventPayload,
} from "@/types";

type FormState = {
    title: string;
    description: string;
    ageRestriction: string;
    startDate: string;
    endDate: string;
    salesStartDate: string;
};

const EMPTY_FORM: FormState = {
    title: "",
    description: "",
    ageRestriction: "0",
    startDate: "",
    endDate: "",
    salesStartDate: "",
};

/**
 * Converte um valor vindo do backend (`LocalDateTime` serializado como
 * `"2025-12-01T18:00:00"`) para o formato aceito por `<input type="datetime-local">`
 * (`"2025-12-01T18:00"`). Não aplica timezone.
 */
function isoToDateTimeLocal(value: string | null | undefined): string {
    if (!value) return "";
    const [date, time] = value.split("T");
    if (!date || !time) return "";
    return `${date}T${time.substring(0, 5)}`;
}

/**
 * Converte o valor de `<input type="datetime-local">` (`YYYY-MM-DDTHH:mm`)
 * para o formato `LocalDateTime` esperado pelo backend (`YYYY-MM-DDTHH:mm:ss`).
 */
function dateTimeLocalToLocalDateTime(value: string): string | null {
    if (!value) return null;
    return value.length === 16 ? `${value}:00` : value;
}

function eventToFormState(event: EventDetailDTO): FormState {
    return {
        title: event.title ?? "",
        description: event.description ?? "",
        ageRestriction: String(event.ageRestriction ?? 0),
        startDate: isoToDateTimeLocal(event.startDate),
        endDate: isoToDateTimeLocal(event.endDate),
        salesStartDate: isoToDateTimeLocal(event.salesStartDate),
    };
}

function buildPatchPayload(
    form: FormState,
    original: EventDetailDTO
): UpdateEventPayload {
    const payload: UpdateEventPayload = {};

    if (form.title !== original.title) {
        payload.title = form.title;
    }
    if (form.description !== original.description) {
        payload.description = form.description;
    }

    const ageValue = Number(form.ageRestriction);
    if (Number.isFinite(ageValue) && ageValue !== original.ageRestriction) {
        payload.ageRestriction = ageValue;
    }

    const nextStart = dateTimeLocalToLocalDateTime(form.startDate);
    if (nextStart && nextStart !== original.startDate) {
        payload.startDate = nextStart;
    }

    const nextEnd = dateTimeLocalToLocalDateTime(form.endDate);
    if (nextEnd && nextEnd !== original.endDate) {
        payload.endDate = nextEnd;
    }

    const nextSalesStart = dateTimeLocalToLocalDateTime(form.salesStartDate);
    if (nextSalesStart !== (original.salesStartDate ?? null)) {
        payload.salesStartDate = nextSalesStart;
    }

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

const EditarEvento = () => {
    const navigate = useNavigate();
    const { eventId } = useParams<{ eventId: string }>();

    const [event, setEvent] = useState<EventDetailDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchEvent = useCallback(
        (signal?: AbortSignal) => {
            if (!eventId) return;
            setIsLoading(true);
            setError(null);

            return eventService
                .getEventById(eventId, signal)
                .then((data) => {
                    setEvent(data);
                    setForm(eventToFormState(data));
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    setError(
                        getAxiosErrorMessage(err, "Evento não encontrado.")
                    );
                    setEvent(null);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        [eventId]
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchEvent(controller.signal);
        return () => controller.abort();
    }, [fetchEvent]);

    useEffect(() => {
        if (!successMessage) return;
        const id = window.setTimeout(() => setSuccessMessage(null), 3500);
        return () => window.clearTimeout(id);
    }, [successMessage]);

    const patchPayload = useMemo(() => {
        if (!event) return {};
        return buildPatchPayload(form, event);
    }, [form, event]);

    const hasChanges = Object.keys(patchPayload).length > 0;

    const handleFieldChange =
        <K extends keyof FormState>(field: K) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleSave = async () => {
        if (!event || !eventId || !hasChanges) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await eventService.updateEvent(
                eventId,
                patchPayload
            );
            setEvent(updated);
            setForm(eventToFormState(updated));
            setSuccessMessage("Evento atualizado com sucesso.");
        } catch (err) {
            setError(
                getAxiosErrorMessage(err, "Não foi possível atualizar o evento.")
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (event) setForm(eventToFormState(event));
    };

    const handleToggleVisibility = async (next: EventVisibilityValue) => {
        if (!event || !eventId) return;
        if (event.eventVisibility?.name === next) return;

        setIsTogglingVisibility(true);
        setError(null);
        try {
            await eventService.updateEventVisibility(eventId, next);
            await fetchEvent();
            setSuccessMessage(
                next === "PUBLIC"
                    ? "Evento agora está público."
                    : "Evento agora está privado."
            );
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível alterar a visibilidade."
                )
            );
        } finally {
            setIsTogglingVisibility(false);
        }
    };

    const handleUploadImages = async (files: File[], mainIndex: number) => {
        if (!eventId || files.length === 0) return;
        setIsUploadingImages(true);
        setError(null);
        try {
            await eventService.uploadEventImages(eventId, files, mainIndex);
            await fetchEvent();
            setSuccessMessage(
                files.length === 1
                    ? "Imagem enviada com sucesso."
                    : `${files.length} imagens enviadas com sucesso.`
            );
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível enviar as imagens."
                )
            );
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!event || !eventId) return;
        const confirmed = window.confirm(
            `Excluir permanentemente "${event.title}"?`
        );
        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);
        try {
            await eventService.deleteEvent(eventId);
            navigate("/admin/eventos");
        } catch (err) {
            setError(
                getAxiosErrorMessage(err, "Não foi possível excluir o evento.")
            );
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/eventos")}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                    <ArrowLeft className="size-3.5" strokeWidth={2.6} />
                    Voltar para eventos
                </button>
            </div>

            <AdminPageHeader
                icon={Pencil}
                title={event ? `Editar: ${event.title}` : "Editar evento"}
                description={
                    event
                        ? `ID #${event.eventID} · última atualização ${new Date(
                              event.lastUpdateDate
                          ).toLocaleString("pt-BR")}`
                        : "Carregando detalhes do evento..."
                }
            />

            {error && <Banner variant="error" message={error} />}
            {successMessage && (
                <Banner variant="success" message={successMessage} />
            )}

            {isLoading && !event ? (
                <div className="flex items-center justify-center rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 py-16 text-sm text-[#5e6c87]">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Carregando evento...
                </div>
            ) : !event ? (
                <div className="rounded-3xl border border-dashed border-red-300/60 bg-red-50/60 p-10 text-center text-sm text-red-500">
                    Não foi possível carregar o evento.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <GlassCard className="lg:col-span-2">
                        <SectionHeader
                            title="Informações gerais"
                            description="Campos editáveis via PATCH /events/{id} (merge-patch+json)."
                        />

                        <div className="flex flex-col gap-4">
                            <Field label="Título" htmlFor="title" required>
                                <TextInput
                                    id="title"
                                    value={form.title}
                                    onChange={handleFieldChange("title")}
                                    placeholder="Nome do evento"
                                />
                            </Field>

                            <Field
                                label="Descrição"
                                htmlFor="description"
                                required
                            >
                                <TextAreaInput
                                    id="description"
                                    value={form.description}
                                    onChange={handleFieldChange("description")}
                                    rows={5}
                                    placeholder="Detalhes e atrações do evento..."
                                />
                            </Field>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Restrição de idade"
                                    htmlFor="ageRestriction"
                                    required
                                >
                                    <TextInput
                                        id="ageRestriction"
                                        type="number"
                                        min={0}
                                        max={99}
                                        value={form.ageRestriction}
                                        onChange={handleFieldChange(
                                            "ageRestriction"
                                        )}
                                    />
                                </Field>

                                <Field
                                    label="Início das vendas"
                                    htmlFor="salesStartDate"
                                >
                                    <TextInput
                                        id="salesStartDate"
                                        type="datetime-local"
                                        value={form.salesStartDate}
                                        onChange={handleFieldChange(
                                            "salesStartDate"
                                        )}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field
                                    label="Data de início"
                                    htmlFor="startDate"
                                    required
                                >
                                    <TextInput
                                        id="startDate"
                                        type="datetime-local"
                                        value={form.startDate}
                                        onChange={handleFieldChange(
                                            "startDate"
                                        )}
                                    />
                                </Field>
                                <Field
                                    label="Data de término"
                                    htmlFor="endDate"
                                    required
                                >
                                    <TextInput
                                        id="endDate"
                                        type="datetime-local"
                                        value={form.endDate}
                                        onChange={handleFieldChange("endDate")}
                                    />
                                </Field>
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
                        <VisibilityCard
                            current={event.eventVisibility?.name ?? "PRIVATE"}
                            isLoading={isTogglingVisibility}
                            onChange={handleToggleVisibility}
                        />

                        <MetadataCard event={event} />

                        <DangerCard
                            isDeleting={isDeleting}
                            onDelete={handleDeleteEvent}
                        />
                    </div>

                    <GlassCard className="lg:col-span-3">
                        <ImagesPanel
                            event={event}
                            isUploading={isUploadingImages}
                            onUpload={handleUploadImages}
                        />
                    </GlassCard>
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
        className={`rounded-3xl border border-white/70 bg-white/65 p-6 backdrop-blur-xl ${className}`}
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
    "w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 text-sm text-[#00334d] placeholder:text-[#5e6c87]/60 backdrop-blur-xl outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)]";

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`${baseInputClasses} h-11 ${props.className ?? ""}`} />
);

const TextAreaInput = (
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
    <textarea
        {...props}
        className={`${baseInputClasses} resize-y ${props.className ?? ""}`}
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

type VisibilityCardProps = {
    current: EventVisibilityValue;
    isLoading: boolean;
    onChange: (value: EventVisibilityValue) => void;
};

const VisibilityCard = ({
    current,
    isLoading,
    onChange,
}: VisibilityCardProps) => {
    const isPublic = current === "PUBLIC";
    return (
        <GlassCard>
            <SectionHeader
                title="Visibilidade"
                description="Endpoint dedicado: PATCH /events/{id}/visibility."
            />

            <div className="flex gap-2">
                <VisibilityButton
                    active={isPublic}
                    onClick={() => onChange("PUBLIC")}
                    disabled={isLoading || isPublic}
                    icon={Eye}
                    label="Público"
                />
                <VisibilityButton
                    active={!isPublic}
                    onClick={() => onChange("PRIVATE")}
                    disabled={isLoading || !isPublic}
                    icon={EyeOff}
                    label="Privado"
                />
            </div>

            {isLoading && (
                <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#5e6c87]">
                    <Loader2 className="size-3 animate-spin" />
                    Atualizando visibilidade...
                </p>
            )}
        </GlassCard>
    );
};

type VisibilityButtonProps = {
    active: boolean;
    onClick: () => void;
    disabled: boolean;
    icon: typeof Eye;
    label: string;
};

const VisibilityButton = ({
    active,
    onClick,
    disabled,
    icon: Icon,
    label,
}: VisibilityButtonProps) => (
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
    event: EventDetailDTO;
};

const MetadataCard = ({ event }: MetadataCardProps) => (
    <GlassCard>
        <SectionHeader title="Metadados" />
        <ul className="flex flex-col gap-2.5 text-sm">
            <MetaRow label="Status" value={event.status?.name ?? "—"} />
            <MetaRow
                label="Local"
                value={
                    event.venue
                        ? `${event.venue.name} · ${event.venue.city}/${event.venue.state}`
                        : "—"
                }
            />
            <MetaRow
                label="Aprovado em"
                value={
                    event.approvalDate
                        ? new Date(event.approvalDate).toLocaleString("pt-BR")
                        : "—"
                }
            />
            <MetaRow
                label="Criado em"
                value={new Date(event.registerDate).toLocaleString("pt-BR")}
            />
        </ul>
    </GlassCard>
);

const MetaRow = ({ label, value }: { label: string; value: string }) => (
    <li className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
            {label}
        </span>
        <span className="text-right text-sm font-semibold text-[#00334d]">
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
        className="rounded-3xl border border-red-200/70 bg-red-50/60 p-6 backdrop-blur-xl"
        style={{
            boxShadow:
                "0 8px 24px -12px rgba(255,50,50,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)",
        }}
    >
        <h2 className="text-lg font-bold text-red-600">Zona de perigo</h2>
        <p className="mt-0.5 text-xs text-red-500/80">
            Exclusão permanente: DELETE /events/{"{id}"}.
        </p>
        <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
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
            Excluir evento
        </button>
    </div>
);

type ImagesPanelProps = {
    event: EventDetailDTO;
    isUploading: boolean;
    onUpload: (files: File[], mainIndex: number) => void;
};

const ImagesPanel = ({ event, isUploading, onUpload }: ImagesPanelProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [pending, setPending] = useState<File[]>([]);
    const [mainIndex, setMainIndex] = useState(0);

    const previews = useMemo(
        () => pending.map((file) => URL.createObjectURL(file)),
        [pending]
    );

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
        if (list.length === 0) return;
        setPending(list);
        setMainIndex(0);
    };

    const clearPending = () => {
        setPending([]);
        setMainIndex(0);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleSend = async () => {
        if (pending.length === 0) return;
        await onUpload(pending, mainIndex);
        clearPending();
    };

    return (
        <div>
            <SectionHeader
                title="Imagens do evento"
                description="Upload multipart para PATCH /events/{id}/images. A imagem marcada vira a principal."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
                <div
                    className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#2a8fd4]/40 bg-linear-to-br from-[#e5f1ff]/40 to-white/30 p-6 text-center backdrop-blur-xl"
                >
                    <div
                        className="flex size-14 items-center justify-center rounded-2xl text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        <ImagePlus className="size-6" strokeWidth={2.4} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#00334d]">
                            Enviar novas imagens
                        </p>
                        <p className="mt-0.5 text-xs text-[#5e6c87]">
                            Os uploads são adicionados às imagens existentes.
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#00334d] transition-all duration-300 hover:bg-white hover:shadow-md"
                    >
                        <Upload className="size-4" strokeWidth={2.6} />
                        Selecionar arquivos
                    </button>

                    {pending.length > 0 && (
                        <div className="mt-3 w-full">
                            <p className="mb-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                {pending.length} arquivo
                                {pending.length === 1 ? "" : "s"} selecionado
                                {pending.length === 1 ? "" : "s"}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {pending.map((file, index) => (
                                    <button
                                        key={file.name + index}
                                        type="button"
                                        onClick={() => setMainIndex(index)}
                                        className={`relative overflow-hidden rounded-xl border transition-all ${
                                            mainIndex === index
                                                ? "border-[#2a8fd4] ring-2 ring-[#2a8fd4]/30"
                                                : "border-white/70 hover:border-[#2a8fd4]/40"
                                        }`}
                                        title="Definir como principal"
                                    >
                                        <img
                                            src={previews[index]}
                                            alt={file.name}
                                            className="aspect-square w-full object-cover"
                                        />
                                        {mainIndex === index && (
                                            <span
                                                className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase text-white"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                                }}
                                            >
                                                <Star className="size-2.5" />
                                                Principal
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={clearPending}
                                    disabled={isUploading}
                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-white/70 bg-white/60 px-3 py-2 text-xs font-semibold text-[#00334d] transition-all hover:bg-white disabled:opacity-50"
                                >
                                    <X className="size-3.5" />
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={isUploading}
                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                        boxShadow:
                                            "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                                    }}
                                >
                                    {isUploading ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                    ) : (
                                        <Upload className="size-3.5" />
                                    )}
                                    Enviar {pending.length} imagem
                                    {pending.length === 1 ? "" : "s"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                        Imagens existentes ({event.images?.length ?? 0})
                    </p>
                    {event.images && event.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {event.images.map((img) => (
                                <div
                                    key={img.eventImageID}
                                    className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/60"
                                    style={{
                                        boxShadow:
                                            "0 4px 14px -6px rgba(0,46,71,0.14), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                                    }}
                                >
                                    <img
                                        src={buildEventImageUrl(img.s3Key)}
                                        alt={`Imagem ${img.eventImageID}`}
                                        className="aspect-square w-full object-cover"
                                    />
                                    {img.mainImage && (
                                        <span
                                            className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                            }}
                                        >
                                            <Star className="size-3" />
                                            Principal
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-6 text-center text-xs text-[#5e6c87]">
                            Este evento ainda não possui imagens cadastradas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditarEvento;
