import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import categoryService from "@/features/admin/admin-categories/services/category.service";
import type {
    EventCategoryDTO,
    UpdateEventCategoryPayload,
} from "@/features/admin/admin-categories/types/category.types";

type FormState = {
    name: string;
};

const EMPTY_FORM: FormState = { name: "" };

function categoryToFormState(category: EventCategoryDTO): FormState {
    return { name: category.name ?? "" };
}

function buildPatchPayload(
    form: FormState,
    original: EventCategoryDTO
): UpdateEventCategoryPayload {
    const payload: UpdateEventCategoryPayload = {};

    if (form.name.trim() !== (original.name ?? "")) {
        payload.name = form.name.trim();
    }

    return payload;
}

function getAxiosErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as
            | { message?: string; error?: string; errors?: string[] }
            | undefined;
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
            return data.errors.join(" · ");
        }
        return data?.message ?? data?.error ?? err.message ?? fallback;
    }
    return fallback;
}

export const useCategoryForm = (categoryId?: string) => {
    const [category, setCategory] = useState<EventCategoryDTO | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchCategory = useCallback(
        (signal?: AbortSignal) => {
            if (!categoryId) return;
            setIsLoading(true);
            setError(null);

            return categoryService
                .getEventCategoryById(categoryId, signal)
                .then((data) => {
                    setCategory(data);
                    setForm(categoryToFormState(data));
                })
                .catch((err: unknown) => {
                    if (axios.isCancel(err)) return;
                    setError(
                        getAxiosErrorMessage(err, "Categoria não encontrada.")
                    );
                    setCategory(null);
                })
                .finally(() => {
                    if (!signal?.aborted) setIsLoading(false);
                });
        },
        [categoryId]
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchCategory(controller.signal);
        return () => controller.abort();
    }, [fetchCategory]);

    useEffect(() => {
        if (!successMessage) return;
        const id = window.setTimeout(() => setSuccessMessage(null), 3500);
        return () => window.clearTimeout(id);
    }, [successMessage]);

    const patchPayload = useMemo(() => {
        if (!category) return {};
        return buildPatchPayload(form, category);
    }, [form, category]);

    const hasChanges = Object.keys(patchPayload).length > 0;

    const liveSlug = useMemo(() => {
        if (!form.name) return "";
        return form.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s-]+/g, "-");
    }, [form.name]);

    const handleFieldChange =
        <K extends keyof FormState>(field: K) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleSave = async () => {
        if (!category || !categoryId || !hasChanges) return;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await categoryService.updateEventCategory(
                categoryId,
                patchPayload
            );
            setCategory(updated);
            setForm(categoryToFormState(updated));
            setSuccessMessage("Categoria atualizada com sucesso.");
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível atualizar a categoria."
                )
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (category) setForm(categoryToFormState(category));
    };

    const handleDelete = async (
        onDeleted: () => void,
        confirmDelete: (categoryName: string) => boolean
    ) => {
        if (!category || !categoryId) return;
        const confirmed = confirmDelete(category.name);
        if (!confirmed) return;

        setIsDeleting(true);
        setError(null);
        try {
            await categoryService.deleteEventCategory(categoryId);
            onDeleted();
        } catch (err) {
            setError(
                getAxiosErrorMessage(
                    err,
                    "Não foi possível excluir a categoria."
                )
            );
            setIsDeleting(false);
        }
    };

    return {
        category,
        form,
        isLoading,
        isSaving,
        isDeleting,
        error,
        successMessage,
        hasChanges,
        liveSlug,
        handleFieldChange,
        handleSave,
        handleReset,
        handleDelete,
    };
};
