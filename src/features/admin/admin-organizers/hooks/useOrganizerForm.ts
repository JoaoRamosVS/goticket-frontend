import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import organizerService from "@/features/admin/admin-organizers/services/organizer.service";
import type {
    OrganizerDetailDTO,
    StatusValue,
    UpdateOrganizerPayload,
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

export const useOrganizerForm = (organizerId?: string) => {
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
                { status: STATUS_OPTIONS[next] }
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

    return {
        organizer,
        form,
        isLoading,
        isSaving,
        isTogglingStatus,
        error,
        successMessage,
        hasChanges,
        handleFieldChange,
        handleSave,
        handleReset,
        handleToggleStatus,
    };
};
