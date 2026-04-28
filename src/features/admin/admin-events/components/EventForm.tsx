import { useEffect, useMemo, useRef, useState } from "react";
import {
    CheckCircle2,
    Eye,
    EyeOff,
    GripVertical,
    Hash,
    ImagePlus,
    Info,
    Loader2,
    Save,
    Star,
    Tags,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { buildEventImageUrl } from "@/utils/events";
import type {
    EventDetailDTO,
    EventImageDTO,
    EventVisibilityValue,
} from "@/features/admin/admin-events/types/event.types";
import type { EventCategoryDTO } from "@/features/admin/admin-categories/types/category.types";

type FormState = {
    title: string;
    description: string;
    ageRestriction: string;
    startDate: string;
    endDate: string;
    salesStartDate: string;
};

type EventFormProps = {
    event: EventDetailDTO | null;
    form: FormState;
    categories: EventCategoryDTO[];
    isLoadingCategories: boolean;
    isSavingCategory: boolean;
    isLoading: boolean;
    isSaving: boolean;
    isTogglingVisibility: boolean;
    isUploadingImages: boolean;
    isSavingImageOrder: boolean;
    isDeleting: boolean;
    error: string | null;
    successMessage: string | null;
    hasChanges: boolean;
    onFieldChange: <K extends keyof FormState>(
        field: K
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onReset: () => void;
    onToggleVisibility: (value: EventVisibilityValue) => void;
    onChangeCategory: (categoryId: number) => void;
    onDeleteEvent: () => void;
    onUploadImages: (files: File[], mainIndex: number) => void;
    onSaveImageOrder: (orderedS3Keys: string[]) => void | Promise<void>;
};

function sortEventImages(images: EventImageDTO[]): EventImageDTO[] {
    return [...images].sort((a, b) => {
        const oa = a.ordination ?? a.eventImageID;
        const ob = b.ordination ?? b.eventImageID;
        return oa - ob;
    });
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
    if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= arr.length ||
        to >= arr.length
    ) {
        return [...arr];
    }
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
}

export const EventForm = ({
    event,
    form,
    categories,
    isLoadingCategories,
    isSavingCategory,
    isLoading,
    isSaving,
    isTogglingVisibility,
    isUploadingImages,
    isSavingImageOrder,
    isDeleting,
    error,
    successMessage,
    hasChanges,
    onFieldChange,
    onSave,
    onReset,
    onToggleVisibility,
    onChangeCategory,
    onDeleteEvent,
    onUploadImages,
    onSaveImageOrder,
}: EventFormProps) => {
    return (
        <>
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
                            description="Edite as informações e detalhes gerais do evento."
                        />

                        <div className="flex flex-col gap-4">
                            <Field label="Título" htmlFor="title" required>
                                <TextInput
                                    id="title"
                                    value={form.title}
                                    onChange={onFieldChange("title")}
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
                                    onChange={onFieldChange("description")}
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
                                        onChange={onFieldChange(
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
                                        onChange={onFieldChange(
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
                                        onChange={onFieldChange(
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
                                        onChange={onFieldChange("endDate")}
                                    />
                                </Field>
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
                        <VisibilityCard
                            current={event.eventVisibility?.name ?? "PRIVATE"}
                            isLoading={isTogglingVisibility}
                            onChange={onToggleVisibility}
                        />

                        <CategoryCard
                            current={event.category}
                            categories={categories}
                            isLoadingCategories={isLoadingCategories}
                            isSaving={isSavingCategory}
                            onChange={onChangeCategory}
                        />

                        <MetadataCard event={event} />

                        <DangerCard
                            isDeleting={isDeleting}
                            onDelete={onDeleteEvent}
                        />
                    </div>

                    <GlassCard className="lg:col-span-3">
                        <ImagesPanel
                            event={event}
                            isUploading={isUploadingImages}
                            isSavingOrder={isSavingImageOrder}
                            onUpload={onUploadImages}
                            onSaveOrder={onSaveImageOrder}
                        />
                    </GlassCard>
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
    <input {...props} className={`${baseInputClasses} h-11 ${props.className ?? ""}`} />
);

const TextAreaInput = (
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
    <textarea
        {...props}
        className={`${baseInputClasses} resize-y  ${props.className ?? ""}`}
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
                description="Altere a visibilidade do evento para público ou privado."
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

type CategoryCardProps = {
    current: EventCategoryDTO | null;
    categories: EventCategoryDTO[];
    isLoadingCategories: boolean;
    isSaving: boolean;
    onChange: (categoryId: number) => void;
};

const CategoryCard = ({
    current,
    categories,
    isLoadingCategories,
    isSaving,
    onChange,
}: CategoryCardProps) => {
    const [selected, setSelected] = useState<string>(
        current ? String(current.categoryId) : ""
    );

    useEffect(() => {
        setSelected(current ? String(current.categoryId) : "");
    }, [current]);

    const hasOptions = categories.length > 0;
    const hasChange =
        selected !== "" &&
        Number(selected) !== (current?.categoryId ?? -1);

    return (
        <GlassCard>
            <SectionHeader
                title="Categoria"
                description="Defina a categoria deste evento. Cada evento pode ter uma única categoria."
            />

            {current ? (
                <div
                    className="mb-4 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-3 py-2.5"
                    style={{
                        boxShadow:
                            "0 4px 14px -6px rgba(0,46,71,0.14), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                    }}
                >
                    <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                            boxShadow:
                                "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                        }}
                    >
                        <Tags className="size-4" strokeWidth={2.6} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#00334d]">
                            {current.name}
                        </p>
                        <p className="inline-flex items-center gap-1 truncate text-[11px] text-[#5e6c87] font-mono">
                            <Hash className="size-3" strokeWidth={2.6} />
                            {current.slug}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-4 rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-3 text-center text-xs text-[#5e6c87]">
                    Este evento ainda não possui categoria definida.
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="categorySelect"
                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]"
                >
                    Selecionar categoria
                </label>
                <select
                    id="categorySelect"
                    value={selected}
                    disabled={
                        isLoadingCategories || isSaving || !hasOptions
                    }
                    onChange={(e) => setSelected(e.target.value)}
                    className="h-11 w-full cursor-pointer rounded-2xl border border-white/70 bg-white/60 px-4 text-sm text-[#00334d] backdrop-blur-xl shadow-xs outline-none transition-all duration-300 focus:border-[#2a8fd4]/50 focus:bg-white/90 focus:shadow-[0_0_0_4px_rgba(42,143,212,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {!hasOptions && (
                        <option value="" disabled>
                            {isLoadingCategories
                                ? "Carregando categorias..."
                                : "Nenhuma categoria disponível"}
                        </option>
                    )}
                    {hasOptions && (
                        <>
                            <option value="" disabled>
                                Selecione uma categoria
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </>
                    )}
                </select>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => {
                        if (selected !== "") onChange(Number(selected));
                    }}
                    disabled={!hasChange || isSaving}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
                    Aplicar categoria
                </button>
            </div>
        </GlassCard>
    );
};

type MetadataCardProps = {
    event: EventDetailDTO;
};

const MetadataCard = ({ event }: MetadataCardProps) => (
    <GlassCard>
        <SectionHeader title="Metadados" />
        <ul className="flex flex-col gap-2.5 text-sm">
            <MetaRow label="Status" value={event.status?.name ?? "—"} />
            <MetaRow
                label="Categoria"
                value={event.category?.name ?? "—"}
            />
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
        className="rounded-3xl bg-red-50/30 p-6 backdrop-blur-xl"
        style={{
            boxShadow:
                "0 12px 24px -12px rgba(255,50,50,0.18), inset 0 1px 0 0 rgba(255,255,255,0.7)",
        }}
    >
        <h2 className="text-lg font-bold text-red-600">Remoção de evento</h2>
        <p className="mt-0.5 text-xs text-red-500/80">
            Ao clicar no botão abaixo, o evento será excluído permanentemente.
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
            Excluir evento
        </button>
    </div>
);

type ImagesPanelProps = {
    event: EventDetailDTO;
    isUploading: boolean;
    isSavingOrder: boolean;
    onUpload: (files: File[], mainIndex: number) => void;
    onSaveOrder: (orderedS3Keys: string[]) => void | Promise<void>;
};

const DRAG_MIME = "application/x-goticket-image-index";

const ImagesPanel = ({
    event,
    isUploading,
    isSavingOrder,
    onUpload,
    onSaveOrder,
}: ImagesPanelProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [pending, setPending] = useState<File[]>([]);
    const [mainIndex, setMainIndex] = useState(0);

    const serverOrderFingerprint = useMemo(
        () =>
            sortEventImages(event.images ?? [])
                .map((i) => i.s3Key)
                .join("\0"),
        [event.images]
    );

    const [orderedImages, setOrderedImages] = useState<EventImageDTO[]>(() =>
        sortEventImages(event.images ?? [])
    );
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    useEffect(() => {
        setOrderedImages(sortEventImages(event.images ?? []));
    }, [serverOrderFingerprint]);

    const savedKeys = useMemo(
        () => sortEventImages(event.images ?? []).map((i) => i.s3Key),
        [event.images]
    );
    const draftKeys = orderedImages.map((i) => i.s3Key);
    const orderDirty =
        savedKeys.length !== draftKeys.length ||
        savedKeys.some((k, i) => k !== draftKeys[i]);

    const previews = useMemo(
        () => pending.map((file) => URL.createObjectURL(file)),
        [pending]
    );

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragStart =
        (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
            e.dataTransfer.setData(DRAG_MIME, String(index));
            e.dataTransfer.effectAllowed = "move";
            setDraggingIndex(index);
        };

    const handleDragEnd = () => {
        setDraggingIndex(null);
    };

    const handleDropAt =
        (toIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData(DRAG_MIME);
            const from = Number(raw);
            if (!Number.isFinite(from)) {
                setDraggingIndex(null);
                return;
            }
            setOrderedImages((prev) => moveItem(prev, from, toIndex));
            setDraggingIndex(null);
        };

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

    const handleSaveOrderClick = async () => {
        if (!orderDirty || orderedImages.length === 0) return;
        await onSaveOrder(orderedImages.map((img) => img.s3Key));
    };

    return (
        <div>
            <SectionHeader
                title="Imagens do evento"
                description="Envie novas imagens (a marcada como principal fica na 1ª posição) ou reordene as existentes e salve em lote."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_minmax(0,1.4fr)]">
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
                                            className="aspect-square w-full object-cover shadow-2xl"
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

                <div className="flex min-h-0 flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/60 pb-4">
                        <div className="min-w-0 flex-1">
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                Ordenação ({orderedImages.length})
                            </p>
                            <p className="text-xs text-[#5e6c87]">
                                Arraste para a área principal (1ª posição) ou
                                reordene as demais. Nada é enviado ao servidor
                                até você clicar em salvar.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveOrderClick}
                            disabled={
                                !orderDirty ||
                                orderedImages.length === 0 ||
                                isSavingOrder
                            }
                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                            style={{
                                background:
                                    "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                boxShadow:
                                    "0 6px 18px -4px rgba(42,143,212,0.5), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                            }}
                        >
                            {isSavingOrder ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" strokeWidth={2.6} />
                            )}
                            Salvar ordem
                        </button>
                    </div>

                    {orderedImages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-6 text-center text-xs text-[#5e6c87]">
                            Este evento ainda não possui imagens cadastradas.
                        </div>
                    ) : (
                        <>
                            <div>
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                    Imagem principal
                                </p>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDropAt(0)}
                                    className="relative min-h-[160px] rounded-4xl py-8 transition-colors shadow-2xs"
                                >
                                    <div
                                        draggable
                                        onDragStart={handleDragStart(0)}
                                        onDragEnd={handleDragEnd}
                                        className={`group relative mx-auto max-w-[220px] cursor-grab overflow-hidden rounded-xl shadow-2xl bg-white/60 active:cursor-grabbing ${
                                            draggingIndex === 0 ? "opacity-50" : ""
                                        }`}
                                    >
                                        <GripVertical
                                            className="pointer-events-none absolute left-1.5 top-1.5 z-10 size-4 text-white drop-shadow-md"
                                            strokeWidth={2.4}
                                            aria-hidden
                                        />
                                        <img
                                            src={buildEventImageUrl(
                                                orderedImages[0].s3Key
                                            )}
                                            alt="Principal"
                                            className="aspect-square w-full object-cover"
                                            draggable={false}
                                        />
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
                                    </div>
                                </div>
                            </div>

                            {orderedImages.length > 1 && (
                                <div>
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5e6c87]">
                                        Demais imagens
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {orderedImages
                                            .slice(1)
                                            .map((img, sliceIdx) => {
                                                const index = sliceIdx + 1;
                                                return (
                                                    <div
                                                        key={img.s3Key}
                                                        draggable
                                                        onDragStart={handleDragStart(
                                                            index
                                                        )}
                                                        onDragEnd={handleDragEnd}
                                                        onDragOver={handleDragOver}
                                                        onDrop={handleDropAt(
                                                            index
                                                        )}
                                                        className="group relative w-[calc(50%-0.25rem)] cursor-grab overflow-hidden rounded-xl shadow-2xl bg-white/60 sm:w-[calc(15%-0.34rem)] active:cursor-grabbing"
                                                    >
                                                        <GripVertical
                                                            className="pointer-events-none absolute left-1 top-1 z-10 size-3.5 text-white drop-shadow-md"
                                                            strokeWidth={2.4}
                                                            aria-hidden
                                                        />
                                                        <img
                                                            src={buildEventImageUrl(
                                                                img.s3Key
                                                            )}
                                                            alt={`Imagem ${img.eventImageID}`}
                                                            className="aspect-square w-full object-cover"
                                                            draggable={false}
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

