import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import eventService from "@/features/admin/admin-events/services/event.service";
import categoryService from "@/features/admin/admin-categories/services/category.service";
import type {
    EventDetailDTO,
    EventImageDTO,
    EventImageOrderItemDTO,
    EventVisibilityValue,
    UpdateEventPayload,
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

const EMPTY_FORM: FormState = {
    title: "",
    description: "",
    ageRestriction: "0",
    startDate: "",
    endDate: "",
    salesStartDate: "",
};

function isoToDateTimeLocal(value: string | null | undefined): string {
    if (!value) return "";
    const [date, time] = value.split("T");
    if (!date || !time) return "";
    return `${date}T${time.substring(0, 5)}`;
}

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

function sortEventImages(images: EventImageDTO[]): EventImageDTO[] {
    return [...images].sort((a, b) => {
        const oa = a.ordination ?? a.eventImageID;
        const ob = b.ordination ?? b.eventImageID;
        return oa - ob;
    });
}

function reorderWithMainFirst<T>(items: T[], mainIndex: number): T[] {
    if (items.length === 0) return [];
    const clamped = Math.min(Math.max(mainIndex, 0), items.length - 1);
    const main = items[clamped];
    const rest = items.filter((_, i) => i !== clamped);
    return [main, ...rest];
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

export const useEventForm = (eventId?: string) => {
    const [event, setEvent] = useState<EventDetailDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [categories, setCategories] = useState<EventCategoryDTO[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [isSavingImageOrder, setIsSavingImageOrder] = useState(false);
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
        const controller = new AbortController();
        setIsLoadingCategories(true);
        categoryService
            .listEventCategories(controller.signal)
            .then((data) => setCategories(data ?? []))
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return;
                setCategories([]);
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingCategories(false);
            });
        return () => controller.abort();
    }, []);

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
        if (!eventId || !event || files.length === 0) return;
        setIsUploadingImages(true);
        setError(null);
        try {
            const orderedNew = reorderWithMainFirst(files, mainIndex);
            const sortedExisting = sortEventImages(event.images ?? []);
            const metadata: EventImageOrderItemDTO[] = [
                ...sortedExisting.map((img) => ({
                    type: "existing" as const,
                    s3Key: img.s3Key,
                    fileIndex: null,
                })),
                ...orderedNew.map((_, idx) => ({
                    type: "new" as const,
                    s3Key: null,
                    fileIndex: idx,
                })),
            ];
            await eventService.replaceEventImages(
                eventId,
                metadata,
                orderedNew
            );
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

    const handleSaveImageOrder = async (orderedS3Keys: string[]) => {
        if (!eventId || orderedS3Keys.length === 0) return;
        setIsSavingImageOrder(true);
        setError(null);
        try {
            const metadata: EventImageOrderItemDTO[] = orderedS3Keys.map(
                (s3Key) => ({
                    type: "existing" as const,
                    s3Key,
                    fileIndex: null,
                })
            );
            await eventService.replaceEventImages(eventId, metadata, []);
            await fetchEvent();
            setSuccessMessage("Ordem das imagens atualizada.");
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível salvar a ordem das imagens."
                )
            );
        } finally {
            setIsSavingImageOrder(false);
        }
    };

    const handleChangeCategory = async (nextCategoryId: number) => {
        if (!event || !eventId) return;
        if (event.category?.categoryId === nextCategoryId) return;

        setIsSavingCategory(true);
        setError(null);
        try {
            const updated = await eventService.updateEvent(eventId, {
                category: { categoryId: nextCategoryId },
            });
            setEvent(updated);
            setForm(eventToFormState(updated));
            setSuccessMessage("Categoria do evento atualizada.");
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível atualizar a categoria do evento."
                )
            );
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleDeleteEvent = async (onDeleted: () => void) => {
        if (!event || !eventId) return;
        const confirmed = window.confirm(
            `Excluir permanentemente "${event.title}"?`
        );
        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);
        try {
            await eventService.deleteEvent(eventId);
            onDeleted();
        } catch (err) {
            setError(
                getAxiosErrorMessage(err, "Não foi possível excluir o evento.")
            );
            setIsDeleting(false);
        }
    };

    return {
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
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleVisibility,
        handleUploadImages,
        handleSaveImageOrder,
        handleChangeCategory,
        handleDeleteEvent,
    };
};
